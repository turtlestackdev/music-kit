export * from './channel.types'
import type { ChannelNumber } from './channel.types'
import type { DataByte, UndefinedMessage } from './message.types'
import type { ChannelMessage } from './channel.types'
import * as note from './note'
import * as util from './util'
import * as control from './control'
import type { ControlNumber } from './control.types'
import type { ChannelState } from './channel.types'
import type { NoteState } from './note.types'
import { UnimplementedError } from './error'

// Status Constants
export const NOTE_OFF = 0x80
export const NOTE_ON = 0x90
export const POLYPHONIC_KEY_PRESSURE = 0xa0
export const CONTROL_CHANGE = 0xb0
export const CHANNEL_MODE = 0xb0
export const PROGRAM_CHANGE = 0xc0
export const CHANNEL_PRESSURE = 0xd0
export const PITCH_BEND = 0xe0

// Channel Mode Constants
export const ALL_SOUND_OFF = 120
export const RESET_ALL_CONTROLLERS = 121
export const LOCAL_CONTROL = 122
export const ALL_NOTES_OFF = 123
export const OMNI_OFF = 124
export const OMNI_ON = 125
export const MONO_ON = 126
export const MONO_OFF = 127

// These sounds are the same for all MIDI Channels except Channel 10, which has only "percussion" sounds.
export const PERCUSSION_CHANNEL = 10
export function isChannelMessage(status: number) {
  return Number.isInteger(status) && status >= 0x80 && status <= 0xef
}

export function isChannelModeMessage(msb: number, lsb: number) {
  return msb === CHANNEL_MODE && lsb >= 120 && lsb <= 127
}

export function parseMessage(
  status: number,
  channel: ChannelNumber,
  firstDataByte: DataByte,
  secondDataByte: DataByte
): ChannelMessage | UndefinedMessage {
  if (isChannelModeMessage(status, firstDataByte)) {
    // todo implement mode messages
    switch (firstDataByte) {
      case ALL_SOUND_OFF:
        console.log('all sound off')
        break
      case RESET_ALL_CONTROLLERS:
        console.log('RESET_ALL_CONTROLLERS')
        break
      case LOCAL_CONTROL:
        console.log('LOCAL_CONTROL')
        break
      case ALL_NOTES_OFF:
        console.log('all notes off')
        break
      case OMNI_OFF:
        console.log('omni off')
        break
      case OMNI_ON:
        console.log('OMNI_ON')
        break
      case MONO_ON:
        console.log('MONO_ON')
        break
      case MONO_OFF:
        console.log('MONO_OFF')
        break
    }
  } else {
    const voice = {
      messageCategory: 'Channel',
      messageType: 'Voice',
      channel: channel,
    } as const
    switch (status) {
      case NOTE_OFF:
        return {
          ...voice,
          messageAction: 'Note Off',
          noteNumber: firstDataByte,
          ...note.getPitch(firstDataByte),
        }
      case NOTE_ON:
        if (secondDataByte === 0) {
          return {
            ...voice,
            messageAction: 'Note Off',
            noteNumber: firstDataByte,
            channel: channel,
            ...note.getPitch(firstDataByte),
          }
        }

        return {
          ...voice,
          messageAction: 'Note On',
          noteNumber: firstDataByte,
          channel: channel,
          ...note.getPitch(firstDataByte),
          velocity: secondDataByte,
        }

      case POLYPHONIC_KEY_PRESSURE:
        return {
          ...voice,
          messageAction: 'Polyphonic Key Pressure',
          channel: channel,
          noteNumber: firstDataByte,
          ...note.getPitch(firstDataByte),
          aftertouch: secondDataByte,
        }

      case CONTROL_CHANGE:
        // isChannelModeMessage = false means first byte is a control number
        return control.parseMessage(
          channel,
          firstDataByte as ControlNumber,
          secondDataByte
        )

      case PROGRAM_CHANGE:
        return {
          ...voice,
          messageAction: 'Program Change',
          channel: channel,
          program: firstDataByte,
        }
      case CHANNEL_PRESSURE:
        return {
          ...voice,
          messageAction: 'Channel Pressure',
          channel: channel,
          aftertouch: firstDataByte,
        }
      case PITCH_BEND:
        return {
          ...voice,
          messageAction: 'Pitch Bend',
          channel: channel,
          pitchBend: util.calculateMultiByteValue(
            firstDataByte,
            secondDataByte
          ),
        }
    }
  }

  throw new UnimplementedError('channel mode messages not implemented')
}

export const defaultChannel: ChannelState = {
  number: 0,
  notes: new Map<DataByte, NoteState>(),
  controls: {
    registeredParameters: {},
    nonRegisteredParameters: {},
    undefined: {},
  },
  aftertouch: 0,
  pitchBend: 8192,
  program: { program: 0, bank: 0, sound: 0 },
  mode: { mono: false, omni: true },
}
