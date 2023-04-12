export * from './midi.types'
import { MIDIAccessError, MIDISupportError } from './error'
import type { ChannelPendingChanges, Input, InputJSON, InputPendingChanges } from './midi.types'
import * as message from './message'
import * as channel from './channel'
import type { ChannelNumber, ChannelState, ChannelVoiceMessage } from './channel.types'
import type { NoteNumber, NoteState } from './note.types'
import type { DataByte, MIDIMessage } from './message.types'
import { defaultNote, getPitch } from './note'
import type { ControlChangeMessage } from './control.types'
import { calculateMultiByteValue } from './util'

export let access: MIDIAccess

export const inputs: Map<string, Input> = new Map<string, Input>()

const _inputStateListeners: Map<string, Array<(state: Input) => void>> = new Map<
  string,
  Array<(state: Input) => void>
>()

const _inputMessageListeners: Map<string, Array<(msg: MIDIMessage) => void>> = new Map<
  string,
  Array<(msg: MIDIMessage) => void>
>()

const _inputPendingChanges: Map<string, InputPendingChanges> = new Map<
  string,
  InputPendingChanges
>()

export let outputs: MIDIOutputMap = new Map<string, MIDIOutput>()
export async function requestAccess() {
  if (navigator.requestMIDIAccess) {
    try {
      setAccess(await navigator.requestMIDIAccess())
    } catch (_) {
      throw new MIDIAccessError('MIDI access rejected')
    }
  } else {
    throw new MIDISupportError('navigator.requestMIDIAccess is not supported')
  }
}

export function setAccess(midiAccess: MIDIAccess) {
  access = midiAccess
  access.inputs.forEach((input) => {
    _initializeInput(input)
  })
  outputs = access.outputs
  access.onstatechange = (evt: Event) => {
    const event = evt as MIDIConnectionEvent
    if (event.port.type === 'input') {
      const port = inputs.get(event.port.id)
      if (!port) {
        _initializeInput(event.port as MIDIInput)
      } else {
        port.connectionState = event.port.connection
        port.deviceState = event.port.state
      }
    }
    // todo handle output
  }
}

function _initializeInput(input: MIDIInput) {
  const inputState: Input = {
    id: input.id,
    manufacturer: input.manufacturer,
    name: input.name,
    version: input.version,
    deviceState: input.state,
    connectionState: input.connection,
    // Channels will be the heart of the state.
    // We start off as an empty object because we aren't sure what bits an input will use.
    // As messages come in, elements will be added.
    channels: new Map<ChannelNumber, ChannelState>(),
    addStateChangeListener: (callback) => {
      const listeners = _inputStateListeners.get(input.id)
      if (listeners === undefined) {
        _inputStateListeners.set(input.id, [callback])
      } else {
        listeners.push(callback)
      }
    },
    removeStateChangeListener: (callback) => {
      const listeners = _inputStateListeners.get(input.id)
      if (listeners !== undefined) {
        _inputStateListeners.set(
          input.id,
          listeners.filter((fn) => fn !== callback)
        )
      }
    },
    setState: function (this: Input, state) {
      Object.assign(this, state)
      const listeners = _inputStateListeners.get(input.id)
      if (listeners !== undefined) {
        listeners.forEach((callback) => callback(this))
      }
    },
    addMessageListener: (callback) => {
      const listeners = _inputMessageListeners.get(input.id)
      if (listeners === undefined) {
        _inputMessageListeners.set(input.id, [callback])
      } else {
        listeners.push(callback)
      }
    },
    removeMessageListener: (callback) => {
      const listeners = _inputMessageListeners.get(input.id)
      if (listeners !== undefined) {
        _inputMessageListeners.set(
          input.id,
          listeners.filter((fn) => fn !== callback)
        )
      }
    },
    toJSON: function () {
      const json: InputJSON = {
        id: this.id,
        name: this.name,
        manufacturer: this.manufacturer,
        version: this.version,
        channels: {},
      }

      for (const [chNumber, ch] of this.channels) {
        const noteJson: { [key in NoteNumber]?: NoteState } = {}
        for (const [noteNumber, noteState] of ch.notes) {
          noteJson[noteNumber] = noteState
        }
        json.channels[chNumber] = { ...ch, notes: noteJson }
      }

      return json
    },
  }
  input.onmidimessage = _parseInputMessage
  input.onstatechange = _inputStateChange
  inputs.set(input.id, inputState)

  return inputState
}

function _parseInputMessage(this: MIDIInput, event: MIDIMessageEvent) {
  const msg = message.parseMessage(event.data)
  const input = inputs.get(this.id) ?? _initializeInput(this)
  input.setState(_getUpdatedState(input, msg))
  _inputMessageListeners.get(this.id)?.forEach((callback) => callback(msg))
}

function _inputStateChange(this: MIDIInput, event: MIDIConnectionEvent) {
  const state = inputs.get(this.id) ?? _initializeInput(this)
  state.setState({
    deviceState: event.port.state,
    connectionState: event.port.connection,
  })
}

function _getUpdatedState(original: Input, msg: MIDIMessage) {
  const input: Input = Object.assign({}, original)
  switch (msg.messageCategory) {
    case 'Channel':
      // If this is the first channel message initialize the channel state on the input and grab that.
      // Otherwise,  just get the current state.
      // Fow analysis for map has not currently working.
      // So we use ChannelState | undefined followed by an if statement.
      // https://github.com/microsoft/TypeScript/issues/13086
      let channelState: ChannelState | undefined = input.channels.get(msg.channel)

      if (channelState === undefined) {
        channelState = { ...channel.defaultChannel, number: msg.channel }
        input.channels.set(msg.channel, channelState)
      }

      let inputPending: InputPendingChanges | undefined = _inputPendingChanges.get(input.id)

      if (inputPending === undefined) {
        inputPending = new Map<ChannelNumber, ChannelPendingChanges>()
        _inputPendingChanges.set(input.id, inputPending)
      }

      let channelPending: ChannelPendingChanges | undefined = inputPending.get(msg.channel)
      if (channelPending === undefined) {
        channelPending = { noteOff: new Set<DataByte>() }
        inputPending?.set(msg.channel, channelPending)
      }

      switch (msg.messageType) {
        case 'Voice':
          _setChannelVoiceState(msg, channelState, channelPending)
          break

        case 'Mode':
          break
      }
      break
  }

  return input
}
function __addChannelNotes(channel: ChannelState, startNote: DataByte, endNote: DataByte) {
  let sort = false
  for (let noteNumber = startNote; noteNumber < endNote; noteNumber++) {
    if (!channel.notes.has(noteNumber)) {
      channel.notes.set(noteNumber as DataByte, {
        ...defaultNote,
        noteNumber,
        ...getPitch(noteNumber),
        aftertouch: channel.aftertouch,
      })
      sort = true
    }
  }

  if (sort) {
    channel.notes = new Map([...channel.notes.entries()].sort())
  }
}

function _setChannelVoiceState(
  msg: ChannelVoiceMessage,
  channel: ChannelState,
  pending: ChannelPendingChanges
) {
  switch (msg.messageAction) {
    case 'Note Off':
      const channelNote: NoteState = {
        ...(channel.notes.get(msg.noteNumber) ?? {
          ...defaultNote,
          tone: msg.tone,
          semitone: msg.semitone,
          octave: msg.octave,
          noteNumber: msg.noteNumber,
        }),
        on: false,
        velocity: 0,
        aftertouch: channel.aftertouch,
      }

      if (channel.controls.damperPedal?.enabled || channel.notes.get(msg.noteNumber)?.sustain) {
        pending.noteOff.add(msg.noteNumber)
      } else {
        channel.notes.set(msg.noteNumber, channelNote)
      }
      break
    case 'Note On':
      channel.notes.set(msg.noteNumber, {
        ...(channel.notes.get(msg.noteNumber) ?? {
          ...defaultNote,
          tone: msg.tone,
          semitone: msg.semitone,
          octave: msg.octave,
          noteNumber: msg.noteNumber,
        }),
        on: true,
        velocity: msg.velocity,
        aftertouch: channel.aftertouch,
      })

      // If there is more than one note, assume all notes in between exist
      if (channel.notes.size > 1) {
        const notes = Array.from(channel.notes.keys()).sort(function (a, b) {
          return a - b
        })
        const noteIndex = notes.indexOf(msg.noteNumber)
        const [startNote, endNote]: DataByte[] =
          noteIndex > 0
            ? [notes[noteIndex - 1], msg.noteNumber]
            : [msg.noteNumber, notes[noteIndex + 1]]
        __addChannelNotes(channel, startNote, endNote)
      }

      // remove any pending off messages, because they will be replaced by a subsequent note off message
      pending.noteOff.delete(msg.noteNumber)
      break
    case 'Polyphonic Key Pressure':
      let note = channel.notes.get(msg.noteNumber)
      if (note) {
        note.aftertouch = msg.aftertouch
      } else {
        // aftertouch should be zero if note on wasn't previously sent
        note = {
          ...defaultNote,
          noteNumber: msg.noteNumber,
          tone: msg.tone,
          semitone: msg.semitone,
          octave: msg.octave,
        }
      }
      channel.notes.set(msg.noteNumber, note)
      break

    case 'Channel Pressure':
      channel.aftertouch = msg.aftertouch
      channel.notes.forEach((note) => (note.aftertouch = channel.aftertouch))
      break

    case 'Pitch Bend':
      channel.pitchBend = msg.pitchBend
      break

    case 'Program Change':
      channel.program = {
        program: msg.program,
        bank: channel.controls.bankSelect?.msb ?? 0,
        sound: channel.controls.bankSelect?.lsb ?? 0,
      }
      break
    case 'Control Change':
      _setChannelControls(msg, channel, pending)
      break
  }
}

function _setChannelControls(
  msg: ControlChangeMessage,
  channel: ChannelState,
  pending: ChannelPendingChanges
) {
  switch (msg.controlType) {
    case 'multiByte':
      if (msg.label === 'undefined') {
        const baseControl = Object.assign(
          { msb: 0 as DataByte },
          channel.controls.undefined[msg.controlNumber] ?? {},
          msg.props
        )

        channel.controls.undefined[msg.controlNumber] = {
          ...baseControl,
          value: calculateMultiByteValue(baseControl.msb, baseControl.lsb),
        }
      } else {
        const baseControl = Object.assign(
          { msb: 0 as DataByte },
          channel.controls[msg.label] ?? {},
          msg.props
        )

        channel.controls[msg.label] = {
          ...baseControl,
          value: calculateMultiByteValue(baseControl.msb, baseControl.lsb),
        }
      }
      break
    case 'switch':
      channel.controls[msg.label] = msg.props
      if (msg.label === 'damperPedal') {
        if (!msg.props.enabled) {
          pending.noteOff.forEach((pitch) => {
            const note = channel.notes.get(pitch)
            if (note && !note.sustain) {
              note.on = false
              note.velocity = 0
              pending.noteOff.delete(pitch)
            }
          })
        }
      }

      if (msg.label === 'sostenutoPedal') {
        channel.notes.forEach((note) => {
          if (msg.props.enabled) {
            if (note.on) {
              note.sustain = true
            }
          } else {
            if (note.sustain && pending.noteOff.has(note.noteNumber)) {
              note.on = false
              note.velocity = 0
              pending.noteOff.delete(note.noteNumber)
            }
            note.sustain = false
          }
        })
      }
      break
    case 'singleByte':
      if (msg.label === 'undefined') {
        channel.controls.undefined[msg.controlNumber] = msg.props
      } else {
        channel.controls[msg.label] = msg.props
      }
      break
    case 'parameterNumberLSB':
      // todo figure this out
      break
    case 'parameterNumberMSB':
      // todo figure this out
      break
  }
}
