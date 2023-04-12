export * from './message.types'
import type {
  StatusByte,
  DataByte,
  Byte,
  MIDIMessage,
  MultiByteValue,
} from './message.types'
import type { ChannelNumber } from './channel.types'
import * as channel from './channel'
import {
  CHANNEL_PRESSURE,
  CONTROL_CHANGE,
  NOTE_OFF,
  NOTE_ON,
  PITCH_BEND,
  POLYPHONIC_KEY_PRESSURE,
  PROGRAM_CHANGE,
} from './channel'
import { getNoteNumber } from './note'
import { getMsbAndLsb } from './util'
import { UnimplementedError } from './error'

// Type Guard for StatusByte
export function isStatusByte(byte: number): byte is StatusByte {
  return isByte(byte) && byte >= 128
}

// Type Guard for DataByte
export function isDataByte(byte: number): byte is DataByte {
  return isByte(byte) && byte <= 127
}

// Type Guard Byte
export function isByte(byte: number): byte is Byte {
  return Number.isInteger(byte) && byte >= 0 && byte <= 255
}

export function isMultiByteValue(value: number): value is MultiByteValue {
  return Number.isInteger(value) && value >= 0 && value <= 16383
}

export function isChannelNumber(channel: number): channel is ChannelNumber {
  return Number.isInteger(channel) && channel >= 0 && channel <= 15
}

export function parseMessage(rawMessage: Uint8Array) {
  if (!isStatusByte(rawMessage[0])) {
    // WebMIDI API unrolls any running status input messages to 3 bytes.
    // So this should always be a status byte.
    // https://github.com/WebAudio/web-midi-api/issues/109#issuecomment-65444947
    // Just in case we check and treat as a noop
    return {}
  }

  //  Most Significant Bit
  const msb = rawMessage[0] & 0xf0
  // Least Significant Bit
  const lsb = rawMessage[0] & 0x0f

  const firstDataByte: DataByte =
    rawMessage.length > 1 && isDataByte(rawMessage[1]) ? rawMessage[1] : 0
  const secondDataByte: DataByte =
    rawMessage.length > 2 && isDataByte(rawMessage[2]) ? rawMessage[2] : 0

  if (channel.isChannelMessage(msb)) {
    const channelNumber: ChannelNumber = lsb as ChannelNumber
    return channel.parseMessage(
      msb,
      channelNumber,
      firstDataByte,
      secondDataByte
    )
  }

  // todo handle system messages
  throw new UnimplementedError('system messages not implemented yet')
}

export function getMessageData(msg: MIDIMessage) {
  switch (msg.messageCategory) {
    case 'Channel':
      switch (msg.messageType) {
        case 'Voice':
          switch (msg.messageAction) {
            case 'Note Off':
              return new Uint8Array([
                NOTE_OFF + msg.channel,
                getNoteNumber({
                  tone: msg.tone,
                  semitone: msg.semitone,
                  octave: msg.octave,
                }),
                0,
              ])
            case 'Note On':
              return new Uint8Array([
                NOTE_ON + msg.channel,
                getNoteNumber({
                  tone: msg.tone,
                  semitone: msg.semitone,
                  octave: msg.octave,
                }),
                msg.velocity,
              ])
            case 'Polyphonic Key Pressure':
              return new Uint8Array([
                POLYPHONIC_KEY_PRESSURE + msg.channel,
                getNoteNumber({
                  tone: msg.tone,
                  semitone: msg.semitone,
                  octave: msg.octave,
                }),
                msg.aftertouch,
              ])
            case 'Channel Pressure':
              return new Uint8Array([
                CHANNEL_PRESSURE + msg.channel,
                msg.aftertouch,
              ])
            case 'Pitch Bend':
              return new Uint8Array([
                PITCH_BEND + msg.channel,
                ...getMsbAndLsb(msg.pitchBend),
              ])
            case 'Program Change':
              return new Uint8Array([PROGRAM_CHANGE + msg.channel, msg.program])
            case 'Control Change':
              switch (msg.controlType) {
                case 'parameterNumberMSB':
                  return new Uint8Array([
                    CONTROL_CHANGE + msg.channel,
                    msg.controlNumber,
                    msg.props.msb,
                  ])
                case 'parameterNumberLSB':
                  return new Uint8Array([
                    CONTROL_CHANGE + msg.channel,
                    msg.controlNumber,
                    msg.props.lsb,
                  ])
                case 'multiByte':
                  const controlNumber =
                    msg.props.lsb > 0
                      ? msg.controlNumber + 32
                      : msg.controlNumber
                  return new Uint8Array([
                    CONTROL_CHANGE + msg.channel,
                    controlNumber,
                    msg.props?.msb || msg.props.lsb,
                  ])
                case 'switch':
                  return new Uint8Array([
                    CONTROL_CHANGE + msg.channel,
                    msg.controlNumber,
                    msg.props.enabled ? 127 : 0,
                  ])
                case 'singleByte':
                  return new Uint8Array([
                    CONTROL_CHANGE + msg.channel,
                    msg.controlNumber,
                    msg.props.value,
                  ])
              }
          }
      }
  }
  throw new UnimplementedError('todo, implement rest of getMessageData')
}
