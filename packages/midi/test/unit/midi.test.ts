/**
 * @vitest-environment jsdom
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { MIDIAccessError, MIDISupportError } from '../../src/error'
import type * as midi from '../../src/midi'
import * as helpers from '../helpers'
import type { MIDIMessage, DataByte } from '../../src/message.types'
import { getPitch, NATURAL, SHARP } from '../../src/note'
import type { Input } from '../../src/midi.types'
import type {
  ChannelPressure,
  NoteOff,
  NoteOn,
  PitchBend,
  PolyphonicKeyPressure,
} from '../../src/channel.types'
import type {
  DamperOff,
  DamperOn,
  SostenutoOff,
  SostenutoOn,
  SwitchControl,
} from '../../src/control.types'

let useMidiModule: typeof midi

describe('test request access function', () => {
  beforeEach(async () => {
    useMidiModule = await import('../../src/midi')
  })

  afterEach(() => {
    vi.resetModules()
  })

  let midiModule: typeof useMidiModule
  test('should throw not supported error', async () => {
    midiModule = useMidiModule
    expect.assertions(1)
    try {
      await midiModule.requestAccess()
    } catch (e) {
      expect(e).toEqual(new MIDISupportError('navigator.requestMIDIAccess is not supported'))
    }
  })

  test('should throw access denied error', async () => {
    midiModule = useMidiModule
    helpers.configureMIDIRejected()

    expect.assertions(1)
    try {
      await midiModule.requestAccess()
    } catch (e) {
      expect(e).toEqual(new MIDIAccessError('MIDI access rejected'))
    }
  })

  test('should grant MIDI access', async () => {
    midiModule = useMidiModule
    helpers.configureMIDIAccess(
      [
        {
          id: 'ABC-123',
          name: 'MPK mini',
          manufacturer: 'AKAI Professional',
        },
      ],
      [
        {
          id: 'DEF-456',
          name: 'Some Device',
          manufacturer: 'Those Guys!',
        },
      ]
    )

    await midiModule.requestAccess()
    // check inputs were registered
    expect(midiModule.inputs.size).toEqual(1)
    expect(midiModule.inputs.has('ABC-123')).toEqual(true)
    const input = midiModule.inputs.get('ABC-123')
    expect(input?.id).toEqual('ABC-123')
    expect(input?.name).toEqual('MPK mini')
    expect(input?.manufacturer).toEqual('AKAI Professional')

    // check outputs were registered
    expect(midiModule.outputs.size).toEqual(1)
    expect(midiModule.outputs.has('DEF-456')).toEqual(true)
    const output = midiModule.outputs.get('DEF-456')
    expect(output?.id).toEqual('DEF-456')
    expect(output?.name).toEqual('Some Device')
    expect(output?.manufacturer).toEqual('Those Guys!')
  })

  test('input message events parsed and dispatched correctly', () => {
    midiModule = useMidiModule
    midiModule.setAccess(
      helpers.getMIDIAccess([
        {
          id: 'ABC-123',
          name: 'MPK mini',
          manufacturer: 'AKAI Professional',
        },
      ])
    )

    const mockMsgListener = vi.fn((msg: MIDIMessage) => {
      console.log(msg.messageCategory)
    })
    const mockMsgListener2 = vi.fn((msg: MIDIMessage) => {
      console.log(msg.messageType)
    })

    midiModule.inputs.get('ABC-123')?.addMessageListener(mockMsgListener)
    midiModule.inputs.get('ABC-123')?.addMessageListener(mockMsgListener2)

    const baseInput = midiModule.access.inputs.get('ABC-123')
    const msg = helpers.getMIDIMessageEvent({
      messageCategory: 'Channel',
      messageType: 'Voice',
      messageAction: 'Note On',
      tone: 'C',
      semitone: NATURAL,
      octave: 4,
      velocity: 64,
      channel: 2,
      noteNumber: 60,
    })
    baseInput?.dispatchEvent(msg)

    expect(mockMsgListener.mock.calls).toHaveLength(1)
    expect(mockMsgListener2.mock.calls).toHaveLength(1)
    const expectedOn = {
      messageCategory: 'Channel',
      messageType: 'Voice',
      messageAction: 'Note On',
      tone: 'C',
      semitone: NATURAL,
      octave: 4,
      velocity: 64,
      channel: 2,
      noteNumber: 60,
    }
    expect(mockMsgListener.mock.calls[0][0]).toEqual(expectedOn)
    expect(mockMsgListener2.mock.calls[0][0]).toEqual(expectedOn)

    baseInput?.dispatchEvent(
      helpers.getMIDIMessageEvent({
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Note Off',
        tone: 'C',
        semitone: NATURAL,
        octave: 4,
        channel: 2,
        noteNumber: 60,
      })
    )
    expect(mockMsgListener.mock.calls).toHaveLength(2)
    expect(mockMsgListener2.mock.calls).toHaveLength(2)

    const expectedOff = {
      messageCategory: 'Channel',
      messageType: 'Voice',
      messageAction: 'Note Off',
      tone: 'C',
      semitone: NATURAL,
      octave: 4,
      channel: 2,
      noteNumber: 60,
    }
    expect(mockMsgListener.mock.calls[1][0]).toEqual(expectedOff)
    expect(mockMsgListener2.mock.calls[1][0]).toEqual(expectedOff)
  })

  test('input state should be accurate after MIDI events', () => {
    midiModule = useMidiModule
    midiModule.setAccess(
      helpers.getMIDIAccess([
        {
          id: 'ABC-123',
          name: 'MPK mini',
          manufacturer: 'AKAI Professional',
        },
      ])
    )

    const mockStateChangeListener = vi.fn((inputState: Input) => {
      console.log(inputState)
    })

    const input = midiModule.inputs.get('ABC-123')
    input?.addStateChangeListener(mockStateChangeListener)

    const noteOn1: NoteOn = {
      channel: 0,
      messageAction: 'Note On',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 100,
      octave: 7,
      semitone: NATURAL,
      tone: 'E',
      velocity: 64,
    }

    const noteOn2: NoteOn = {
      channel: 0,
      messageAction: 'Note On',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 107,
      octave: 7,
      semitone: NATURAL,
      tone: 'B',
      velocity: 22,
    }

    const noteOn3: NoteOn = {
      channel: 0,
      messageAction: 'Note On',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 98,
      octave: 7,
      semitone: NATURAL,
      tone: 'D',
      velocity: 22,
    }

    const noteOff: NoteOff = {
      channel: 0,
      messageType: 'Voice',
      messageCategory: 'Channel',
      messageAction: 'Note Off',
      noteNumber: 100,
      octave: 7,
      semitone: NATURAL,
      tone: 'E',
    }

    const sustainOn: SwitchControl = {
      channel: 0,
      messageType: 'Voice',
      messageCategory: 'Channel',
      messageAction: 'Control Change',
      controlNumber: 64,
      label: 'damperPedal',
      controlType: 'switch',
      props: { enabled: true },
    }

    const baseInput = midiModule.access.inputs.get('ABC-123')
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOn1))

    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(sustainOn))

    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOff))

    expect(mockStateChangeListener.mock.calls).toHaveLength(3)
    expect(mockStateChangeListener.mock.calls[2][0].channels.get(0)?.notes.get(100)).toEqual({
      octave: 7,
      noteNumber: 100,
      semitone: NATURAL,
      tone: 'E',
      velocity: 64,
      sustain: false,
      on: true,
      aftertouch: 0,
    })

    const sustainOff: SwitchControl = {
      channel: 0,
      messageType: 'Voice',
      messageCategory: 'Channel',
      messageAction: 'Control Change',
      controlNumber: 64,
      label: 'damperPedal',
      controlType: 'switch',
      props: { enabled: false },
    }
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(sustainOff))
    expect(mockStateChangeListener.mock.calls[3][0].channels.get(0)?.notes.get(100)).toEqual({
      octave: 7,
      noteNumber: 100,
      semitone: NATURAL,
      tone: 'E',
      velocity: 0,
      sustain: false,
      on: false,
      aftertouch: 0,
    })

    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOn2))
    const noteEntries = mockStateChangeListener.mock.calls[4][0].channels.get(0)?.notes.entries()
    for (let i = 100; i < 107; i++) {
      expect(noteEntries?.next().value[1]).toEqual({
        noteNumber: i,
        ...getPitch(i),
        velocity: i === noteOn2.noteNumber ? noteOn2.velocity : 0,
        sustain: false,
        on: i === noteOn2.noteNumber,
        aftertouch: 0,
      })
    }

    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOn3))
    for (let i = 98; i < 107; i++) {
      const velocity =
        i === noteOn2.noteNumber
          ? noteOn2.velocity
          : i === noteOn3.noteNumber
          ? noteOn3.velocity
          : 0

      expect(
        mockStateChangeListener.mock.calls[5][0].channels.get(0)?.notes.get(i as DataByte)
      ).toEqual({
        noteNumber: i,
        ...getPitch(i),
        velocity: velocity,
        sustain: false,
        on: i === noteOn2.noteNumber || i === noteOn3.noteNumber,
        aftertouch: 0,
      })
    }

    expect(input?.channels.get(0)?.notes.has(97)).toEqual(false)
    expect(input?.channels.get(0)?.notes.has(108)).toEqual(false)

    const aftertouch: ChannelPressure = {
      aftertouch: 43,
      channel: 0,
      messageAction: 'Channel Pressure',
      messageCategory: 'Channel',
      messageType: 'Voice',
    }
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(aftertouch))
    expect(input?.channels.get(0)?.aftertouch).toEqual(43)
    for (let i = 98; i < 107; i++) {
      expect(input?.channels.get(0)?.notes.get(i as DataByte)?.aftertouch).toEqual(43)
    }

    expect(input?.channels.get(0)?.pitchBend).toEqual(8192)

    const bend: PitchBend = {
      channel: 0,
      messageAction: 'Pitch Bend',
      messageCategory: 'Channel',
      messageType: 'Voice',
      pitchBend: 14000,
    }
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(bend))
    expect(input?.channels.get(0)?.pitchBend).toEqual(14000)
  })

  test('sostenuto and damper pedals affect note on status correctly', () => {
    midiModule = useMidiModule
    midiModule.setAccess(
      helpers.getMIDIAccess([
        {
          id: 'ABC-123',
          name: 'MPK mini',
          manufacturer: 'AKAI Professional',
        },
      ])
    )

    const baseInput = midiModule.access.inputs.get('ABC-123')

    const mockStateChangeListener = vi.fn((inputState: Input) => {
      console.log(inputState.name)
    })

    const input = midiModule.inputs.get('ABC-123')
    input?.addStateChangeListener(mockStateChangeListener)

    const noteOn1: NoteOn = {
      channel: 2,
      messageAction: 'Note On',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 88,
      octave: 6,
      semitone: NATURAL,
      tone: 'E',
      velocity: 99,
    }

    const notePressure1: PolyphonicKeyPressure = {
      channel: 2,
      messageAction: 'Polyphonic Key Pressure',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 88,
      octave: 6,
      semitone: NATURAL,
      tone: 'E',
      aftertouch: 99,
    }

    const noteOff1: NoteOff = {
      channel: 2,
      messageAction: 'Note Off',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 88,
      octave: 6,
      semitone: NATURAL,
      tone: 'E',
    }

    const noteOn2: NoteOn = {
      channel: 2,
      messageAction: 'Note On',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 89,
      octave: 6,
      semitone: NATURAL,
      tone: 'F',
      velocity: 97,
    }

    const noteOff2: NoteOff = {
      channel: 2,
      messageAction: 'Note Off',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 89,
      octave: 6,
      semitone: NATURAL,
      tone: 'F',
    }

    const noteOn3: NoteOn = {
      channel: 2,
      messageAction: 'Note On',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 90,
      octave: 6,
      semitone: SHARP,
      tone: 'F',
      velocity: 92,
    }

    const noteOff3: NoteOff = {
      channel: 2,
      messageAction: 'Note Off',
      messageCategory: 'Channel',
      messageType: 'Voice',
      noteNumber: 90,
      octave: 6,
      semitone: SHARP,
      tone: 'F',
    }

    const damperOn: DamperOn = {
      channel: 2,
      controlNumber: 64,
      controlType: 'switch',
      label: 'damperPedal',
      messageAction: 'Control Change',
      messageCategory: 'Channel',
      messageType: 'Voice',
      props: { enabled: true },
    }

    const damperOff: DamperOff = {
      channel: 2,
      controlNumber: 64,
      controlType: 'switch',
      label: 'damperPedal',
      messageAction: 'Control Change',
      messageCategory: 'Channel',
      messageType: 'Voice',
      props: { enabled: false },
    }

    const sostenutoOn: SostenutoOn = {
      channel: 2,
      controlNumber: 66,
      controlType: 'switch',
      label: 'sostenutoPedal',
      messageAction: 'Control Change',
      messageCategory: 'Channel',
      messageType: 'Voice',
      props: { enabled: true },
    }

    const sostenutoOff: SostenutoOff = {
      channel: 2,
      controlNumber: 66,
      controlType: 'switch',
      label: 'sostenutoPedal',
      messageAction: 'Control Change',
      messageCategory: 'Channel',
      messageType: 'Voice',
      props: { enabled: false },
    }

    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOn1))
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOn2))
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(sostenutoOn))
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOff2))
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOn3))
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(notePressure1))

    expect(
      mockStateChangeListener.mock.calls[4][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.on
    ).toEqual(true)

    expect(
      mockStateChangeListener.mock.calls[4][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.sustain
    ).toEqual(true)

    expect(
      mockStateChangeListener.mock.calls[4][0].channels
        .get(noteOn2.channel)
        ?.notes.get(noteOn2.noteNumber)?.on
    ).toEqual(true)

    expect(
      mockStateChangeListener.mock.calls[4][0].channels
        .get(noteOn2.channel)
        ?.notes.get(noteOn2.noteNumber)?.sustain
    ).toEqual(true)

    expect(
      mockStateChangeListener.mock.calls[4][0].channels
        .get(noteOn3.channel)
        ?.notes.get(noteOn3.noteNumber)?.on
    ).toEqual(true)

    expect(
      mockStateChangeListener.mock.calls[4][0].channels
        .get(noteOn3.channel)
        ?.notes.get(noteOn3.noteNumber)?.sustain
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[5][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.aftertouch
    ).toEqual(99)

    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(sostenutoOff))

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.on
    ).toEqual(true)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.sustain
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn2.channel)
        ?.notes.get(noteOn2.noteNumber)?.on
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn2.channel)
        ?.notes.get(noteOn2.noteNumber)?.sustain
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn3.channel)
        ?.notes.get(noteOn3.noteNumber)?.on
    ).toEqual(true)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn3.channel)
        ?.notes.get(noteOn3.noteNumber)?.sustain
    ).toEqual(false)

    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(damperOn))
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOff1))

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.on
    ).toEqual(true)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.sustain
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.aftertouch
    ).toEqual(99)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn2.channel)
        ?.notes.get(noteOn2.noteNumber)?.on
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn2.channel)
        ?.notes.get(noteOn2.noteNumber)?.sustain
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn3.channel)
        ?.notes.get(noteOn3.noteNumber)?.on
    ).toEqual(true)

    expect(
      mockStateChangeListener.mock.calls[6][0].channels
        .get(noteOn3.channel)
        ?.notes.get(noteOn3.noteNumber)?.sustain
    ).toEqual(false)

    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(damperOff))
    expect(
      mockStateChangeListener.mock.calls[7][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.on
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[7][0].channels
        .get(noteOn2.channel)
        ?.notes.get(noteOn2.noteNumber)?.on
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[7][0].channels
        .get(noteOn3.channel)
        ?.notes.get(noteOn3.noteNumber)?.on
    ).toEqual(true)

    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOff3))
    expect(
      mockStateChangeListener.mock.calls[8][0].channels
        .get(noteOn1.channel)
        ?.notes.get(noteOn1.noteNumber)?.on
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[8][0].channels
        .get(noteOn2.channel)
        ?.notes.get(noteOn2.noteNumber)?.on
    ).toEqual(false)

    expect(
      mockStateChangeListener.mock.calls[8][0].channels
        .get(noteOn3.channel)
        ?.notes.get(noteOn3.noteNumber)?.on
    ).toEqual(false)
  })

  test('out of order note actions register the note in an inert state', () => {
    midiModule = useMidiModule
    midiModule.setAccess(
      helpers.getMIDIAccess([
        {
          id: 'ABC-123',
          name: 'MPK mini',
          manufacturer: 'AKAI Professional',
        },
      ])
    )

    const noteOff: NoteOff = {
      channel: 0,
      messageType: 'Voice',
      messageCategory: 'Channel',
      messageAction: 'Note Off',
      noteNumber: 50,
      octave: 3,
      semitone: NATURAL,
      tone: 'D',
    }

    const keyPressure: PolyphonicKeyPressure = {
      channel: 0,
      messageType: 'Voice',
      messageCategory: 'Channel',
      messageAction: 'Polyphonic Key Pressure',
      noteNumber: 55,
      octave: 3,
      semitone: NATURAL,
      tone: 'G',
      aftertouch: 100,
    }

    const input = midiModule.inputs.get('ABC-123')
    const baseInput = midiModule.access.inputs.get('ABC-123')
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(noteOff))
    baseInput?.dispatchEvent(helpers.getMIDIMessageEvent(keyPressure))

    expect(input?.channels.get(0)?.notes.get(50)).toEqual({
      octave: 3,
      noteNumber: 50,
      semitone: NATURAL,
      tone: 'D',
      velocity: 0,
      sustain: false,
      on: false,
      aftertouch: 0,
    })

    expect(input?.channels.get(0)?.notes.get(55)).toEqual({
      octave: 3,
      noteNumber: 55,
      semitone: NATURAL,
      tone: 'G',
      velocity: 0,
      sustain: false,
      on: false,
      aftertouch: 0,
    })
  })
})
