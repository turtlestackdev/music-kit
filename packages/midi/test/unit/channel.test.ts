import { describe, test, expect } from 'vitest'
import * as channel from '../../src/channel'
import { isChannelNumber, isDataByte, isStatusByte } from '../../src/message'
import type {
  ChannelPressure,
  NoteOff,
  NoteOn,
  PitchBend,
  PolyphonicKeyPressure,
  ProgramChange,
} from '../../src/channel.types'
import { isChannelModeMessage } from '../../src/channel'
import type { ControlChangeMessage } from '../../src/control.types'
describe('test channel type guards', () => {
  test('status byte messages correctly interpreted as channel voice', () => {
    let value = 128
    while (isStatusByte(value)) {
      if (value <= 239) {
        expect(channel.isChannelMessage(value)).toEqual(true)
      } else {
        expect(channel.isChannelMessage(value)).toEqual(false)
      }
      value++
    }
  })

  test('control change and channel mode distinguished correctly', () => {
    let msb = 128,
      lsb = 0
    while (isStatusByte(msb)) {
      while (isDataByte(lsb)) {
        const isMode = channel.isChannelModeMessage(msb, lsb)
        if (msb === 176 && lsb in [120, 121, 122, 123, 124, 125, 126, 127]) {
          expect(isMode).toEqual(true)
        } else {
          expect(isMode).toEqual(false)
        }
        lsb++
      }
      msb++
    }
  })
})

describe('parse channel messages', () => {
  test('parse note off messages', () => {
    const statusByte = 0x80
    let channelNumber = 0
    let firstDataByte = 0
    let secondDataByte = 0
    while (isChannelNumber(channelNumber)) {
      while (isDataByte(firstDataByte)) {
        while (isDataByte(secondDataByte)) {
          const msg = channel.parseMessage(
            statusByte,
            channelNumber,
            firstDataByte,
            secondDataByte
          ) as NoteOff // casting so the type system doesn't complain when we are testing for the presence of values

          expect({
            messageCategory: msg.messageCategory,
            messageType: msg.messageType,
          }).toEqual({ messageCategory: 'Channel', messageType: 'Voice' })

          expect(msg.messageAction).toEqual('Note Off')
          expect(msg.noteNumber).toEqual(firstDataByte)
          expect(msg.channel).toEqual(channelNumber)

          secondDataByte++
        }
        firstDataByte++
      }
      channelNumber++
    }
  })

  test('parse note on messages', () => {
    const statusByte = 0x90
    let channelNumber = 0
    let firstDataByte = 0
    let secondDataByte = 0
    while (isChannelNumber(channelNumber)) {
      while (isDataByte(firstDataByte)) {
        while (isDataByte(secondDataByte)) {
          const msg = channel.parseMessage(
            statusByte,
            channelNumber,
            firstDataByte,
            secondDataByte
          ) as NoteOff | NoteOn // casting so the type system doesn't complain when we are testing for the presence of values

          expect({
            messageCategory: msg.messageCategory,
            messageType: msg.messageType,
          }).toEqual({ messageCategory: 'Channel', messageType: 'Voice' })

          if (secondDataByte === 0) {
            expect(msg.messageAction).toEqual('Note Off')
          } else {
            expect(msg.messageAction).toEqual('Note On')
            expect('velocity' in msg).toEqual(true)
            if ('velocity' in msg) {
              expect(msg.velocity).toEqual(secondDataByte)
            } else {
              expect(false).toEqual(true)
            }
          }

          expect(msg.noteNumber).toEqual(firstDataByte)
          expect(msg.channel).toEqual(channelNumber)

          secondDataByte++
        }
        firstDataByte++
      }
      channelNumber++
    }
  })

  test('parse key aftertouch messages', () => {
    const statusByte = 0xa0
    let channelNumber = 0
    let firstDataByte = 0
    let secondDataByte = 0
    while (isChannelNumber(channelNumber)) {
      while (isDataByte(firstDataByte)) {
        while (isDataByte(secondDataByte)) {
          const msg = channel.parseMessage(
            statusByte,
            channelNumber,
            firstDataByte,
            secondDataByte
          ) as PolyphonicKeyPressure // casting so the type system doesn't complain when we are testing for the presence of values

          expect({
            messageCategory: msg.messageCategory,
            messageType: msg.messageType,
          }).toEqual({ messageCategory: 'Channel', messageType: 'Voice' })

          expect(msg.messageAction).toEqual('Polyphonic Key Pressure')
          expect(msg.aftertouch).toEqual(secondDataByte)
          expect(msg.noteNumber).toEqual(firstDataByte)
          expect(msg.channel).toEqual(channelNumber)

          secondDataByte++
        }
        firstDataByte++
      }
      channelNumber++
    }
  })

  test('parse channel aftertouch messages', () => {
    const statusByte = 0xd0
    let channelNumber = 0
    let firstDataByte = 0
    let secondDataByte = 0
    while (isChannelNumber(channelNumber)) {
      while (isDataByte(firstDataByte)) {
        while (isDataByte(secondDataByte)) {
          const msg = channel.parseMessage(
            statusByte,
            channelNumber,
            firstDataByte,
            secondDataByte
          ) as ChannelPressure // casting so the type system doesn't complain when we are testing for the presence of values

          expect({
            messageCategory: msg.messageCategory,
            messageType: msg.messageType,
          }).toEqual({ messageCategory: 'Channel', messageType: 'Voice' })

          expect(msg.messageAction).toEqual('Channel Pressure')
          expect(msg.aftertouch).toEqual(firstDataByte)
          expect(msg.channel).toEqual(channelNumber)

          secondDataByte++
        }
        firstDataByte++
      }
      channelNumber++
    }
  })

  test('parse program change messages', () => {
    const statusByte = 0xc0
    let channelNumber = 0
    let firstDataByte = 0
    let secondDataByte = 0
    while (isChannelNumber(channelNumber)) {
      while (isDataByte(firstDataByte)) {
        while (isDataByte(secondDataByte)) {
          const msg = channel.parseMessage(
            statusByte,
            channelNumber,
            firstDataByte,
            secondDataByte
          ) as ProgramChange // casting so the type system doesn't complain when we are testing for the presence of values

          expect({
            messageCategory: msg.messageCategory,
            messageType: msg.messageType,
          }).toEqual({ messageCategory: 'Channel', messageType: 'Voice' })

          expect(msg.messageAction).toEqual('Program Change')
          expect(msg.program).toEqual(firstDataByte)
          expect(msg.channel).toEqual(channelNumber)

          secondDataByte++
        }
        firstDataByte++
      }
      channelNumber++
    }
  })

  test('parse pitch bend messages', () => {
    const statusByte = 0xe0
    let channelNumber = 0
    let firstDataByte = 0
    let secondDataByte = 0
    while (isChannelNumber(channelNumber)) {
      while (isDataByte(firstDataByte)) {
        while (isDataByte(secondDataByte)) {
          const msg = channel.parseMessage(
            statusByte,
            channelNumber,
            firstDataByte,
            secondDataByte
          ) as PitchBend // casting so the type system doesn't complain when we are testing for the presence of values

          expect({
            messageCategory: msg.messageCategory,
            messageType: msg.messageType,
          }).toEqual({ messageCategory: 'Channel', messageType: 'Voice' })

          expect(msg.messageAction).toEqual('Pitch Bend')
          expect(msg.pitchBend).toEqual(firstDataByte * 128 + secondDataByte)
          expect(msg.channel).toEqual(channelNumber)

          secondDataByte++
        }
        firstDataByte++
      }
      channelNumber++
    }
  })

  test('parse pitch bend messages', () => {
    const statusByte = 0xb0
    let channelNumber = 0
    let firstDataByte = 0
    let secondDataByte = 0
    while (isChannelNumber(channelNumber)) {
      while (isDataByte(firstDataByte)) {
        while (isDataByte(secondDataByte) && !isChannelModeMessage(statusByte, firstDataByte)) {
          const msg = channel.parseMessage(
            statusByte,
            channelNumber,
            firstDataByte,
            secondDataByte
          ) as ControlChangeMessage // casting so the type system doesn't complain when we are testing for the presence of values

          expect({
            messageCategory: msg.messageCategory,
            messageType: msg.messageType,
          }).toEqual({ messageCategory: 'Channel', messageType: 'Voice' })

          // specific control tests are in control.tests.ts
          expect(msg.messageAction).toEqual('Control Change')
          expect(msg.channel).toEqual(channelNumber)

          secondDataByte++
        }
        firstDataByte++
      }
      channelNumber++
    }
  })
})
