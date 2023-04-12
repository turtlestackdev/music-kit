import { describe, test, expect } from 'vitest'
import * as message from '../../src/message'
import * as note from '../../src/note'
import type { DataByte } from '../../src/message.types'
import type { ChannelNumber, NoteOff, NoteOn } from '../../src/channel.types'

describe('test that all not types parse as expected', () => {
  test('invalid status byte returns empty message', () => {
    expect(message.parseMessage(new Uint8Array([267, 60, 64]))).toEqual({})
  })

  test('note off bytes should return note off messages', () => {
    const noteOff = 128
    const noteNumber = 100
    let channel: ChannelNumber = 0

    while (message.isChannelNumber(channel)) {
      // We don't care too much about a variety of notes and velocities here.
      // Those will be tested in the channel and note unit tests.
      const expected: NoteOff = {
        channel: channel,
        messageAction: 'Note Off',
        messageCategory: 'Channel',
        messageType: 'Voice',
        noteNumber: noteNumber,
        octave: 7,
        semitone: note.NATURAL,
        tone: 'E',
      }

      const actual = message.parseMessage(new Uint8Array([noteOff + channel, noteNumber]))
      expect(actual).toEqual(expected)

      channel++
    }
  })

  test('note on bytes should return note on messages unless velocity is zero', () => {
    const noteOn = 144
    const noteNumber = 90
    const velocity = 67
    let channel: ChannelNumber = 0

    while (message.isChannelNumber(channel)) {
      const expected: NoteOn = {
        channel: channel,
        messageAction: 'Note On',
        messageCategory: 'Channel',
        messageType: 'Voice',
        noteNumber: noteNumber,
        octave: 6,
        semitone: note.SHARP,
        tone: 'F',
        velocity: (velocity + channel) as Exclude<DataByte, 0>,
      }

      const actual = message.parseMessage(
        new Uint8Array([noteOn + channel, noteNumber, velocity + channel])
      )
      expect(actual).toEqual(expected)

      const expectedOff: NoteOff = {
        channel: channel,
        messageAction: 'Note Off',
        messageCategory: 'Channel',
        messageType: 'Voice',
        noteNumber: noteNumber,
        octave: 6,
        semitone: note.SHARP,
        tone: 'F',
      }

      expect(message.parseMessage(new Uint8Array([noteOn + channel, noteNumber, 0]))).toEqual(
        expectedOff
      )

      channel++
    }
  })
})

describe('messages converted to data bytes correctly', () => {
  test('note off messages convert correctly', () => {
    expect(
      message.getMessageData({
        channel: 0,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Note Off',
        noteNumber: 94,
        octave: 6,
        tone: 'A',
        semitone: note.SHARP,
      })
    ).toEqual(new Uint8Array([0x80, 94, 0]))

    expect(
      message.getMessageData({
        channel: 3,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Note Off',
        noteNumber: 67,
        octave: 4,
        tone: 'G',
        semitone: note.NATURAL,
      })
    ).toEqual(new Uint8Array([0x83, 67, 0]))
  })

  test('note on messages convert correctly', () => {
    expect(
      message.getMessageData({
        channel: 4,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Note On',
        noteNumber: 34,
        octave: 1,
        tone: 'A',
        semitone: note.SHARP,
        velocity: 98,
      })
    ).toEqual(new Uint8Array([0x94, 34, 98]))

    expect(
      message.getMessageData({
        channel: 6,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Note On',
        noteNumber: 105,
        octave: 7,
        tone: 'A',
        semitone: note.NATURAL,
        velocity: 43,
      })
    ).toEqual(new Uint8Array([0x96, 105, 43]))
  })

  test('key aftertouch messages convert correctly', () => {
    expect(
      message.getMessageData({
        channel: 12,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Polyphonic Key Pressure',
        noteNumber: 0,
        octave: -1,
        tone: 'C',
        semitone: note.NATURAL,
        aftertouch: 32,
      })
    ).toEqual(new Uint8Array([0xac, 0, 32]))

    expect(
      message.getMessageData({
        channel: 15,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Polyphonic Key Pressure',
        noteNumber: 21,
        octave: 0,
        tone: 'A',
        semitone: note.NATURAL,
        aftertouch: 77,
      })
    ).toEqual(new Uint8Array([0xaf, 21, 77]))
  })

  test('channel aftertouch messages convert correctly', () => {
    expect(
      message.getMessageData({
        channel: 2,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Channel Pressure',
        aftertouch: 32,
      })
    ).toEqual(new Uint8Array([0xd2, 32]))

    expect(
      message.getMessageData({
        channel: 6,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Channel Pressure',
        aftertouch: 77,
      })
    ).toEqual(new Uint8Array([0xd6, 77]))
  })

  test('program change messages convert correctly', () => {
    expect(
      message.getMessageData({
        channel: 0,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Program Change',
        program: 127,
      })
    ).toEqual(new Uint8Array([0xc0, 127]))

    expect(
      message.getMessageData({
        channel: 10,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Program Change',
        program: 15,
      })
    ).toEqual(new Uint8Array([0xca, 15]))
  })

  test('pitch bend messages convert correctly', () => {
    expect(
      message.getMessageData({
        channel: 8,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Pitch Bend',
        pitchBend: 8192,
      })
    ).toEqual(new Uint8Array([0xe8, 64, 0]))

    expect(
      message.getMessageData({
        channel: 9,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Pitch Bend',
        pitchBend: 4000,
      })
    ).toEqual(new Uint8Array([0xe9, 31, 32]))
  })

  test('control change messages convert correctly', () => {
    expect(
      message.getMessageData({
        channel: 0,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Control Change',
        controlType: 'multiByte',
        controlNumber: 8,
        label: 'balance',
        props: { msb: 80, lsb: 0 },
      })
    ).toEqual(new Uint8Array([0xb0, 8, 80]))

    expect(
      message.getMessageData({
        channel: 0,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Control Change',
        controlType: 'multiByte',
        controlNumber: 8,
        label: 'balance',
        props: { lsb: 64 },
      })
    ).toEqual(new Uint8Array([0xb0, 40, 64]))

    expect(
      message.getMessageData({
        channel: 1,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Control Change',
        controlType: 'switch',
        controlNumber: 64,
        label: 'damperPedal',
        props: { enabled: true },
      })
    ).toEqual(new Uint8Array([0xb1, 64, 127]))

    expect(
      message.getMessageData({
        channel: 1,
        messageCategory: 'Channel',
        messageType: 'Voice',
        messageAction: 'Control Change',
        controlType: 'singleByte',
        controlNumber: 70,
        label: 'soundVariation',
        props: { value: 45 },
      })
    ).toEqual(new Uint8Array([0xb1, 70, 45]))
  })
})

describe('test type guards', () => {
  test('0-256 should be considered a Byte', () => {
    expect(message.isByte(-1)).toEqual(false)
    expect(message.isByte(10.5)).toEqual(false)
    expect(message.isByte(256)).toEqual(false)
    expect(message.isByte(0)).toEqual(true)
    expect(message.isByte(255)).toEqual(true)
  })

  test('0-127 should be considered a StatusByte', () => {
    expect(message.isDataByte(-1)).toEqual(false)
    expect(message.isDataByte(128)).toEqual(false)
    expect(message.isDataByte(10.5)).toEqual(false)
    expect(message.isDataByte(0)).toEqual(true)
    expect(message.isDataByte(127)).toEqual(true)
  })

  test('128-255 should be considered a StatusByte', () => {
    expect(message.isStatusByte(127)).toEqual(false)
    expect(message.isStatusByte(256)).toEqual(false)
    expect(message.isStatusByte(130.5)).toEqual(false)
    expect(message.isStatusByte(128)).toEqual(true)
    expect(message.isStatusByte(255)).toEqual(true)
  })

  test('0-16383 should be considered a MultiByteValue', () => {
    expect(message.isMultiByteValue(-1)).toEqual(false)
    expect(message.isMultiByteValue(16384)).toEqual(false)
    expect(message.isMultiByteValue(10.5)).toEqual(false)
    expect(message.isMultiByteValue(0)).toEqual(true)
    expect(message.isMultiByteValue(16383)).toEqual(true)
  })

  test('0-15 should be considered a ChannelNumber', () => {
    expect(message.isChannelNumber(-1)).toEqual(false)
    expect(message.isChannelNumber(16)).toEqual(false)
    expect(message.isChannelNumber(10.5)).toEqual(false)
    expect(message.isChannelNumber(0)).toEqual(true)
    expect(message.isChannelNumber(15)).toEqual(true)
  })
})
