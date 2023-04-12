import type { NoteNumber, NoteState, Pitch } from './note.types'
import type { DataByte, MultiByteValue } from './message.types'
import type { ChannelControlState, ControlChangeMessage } from './control.types'

// Channels 0-15
export type ChannelNumber =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15

export interface ChannelMessageProps {
  messageCategory: 'Channel'
  channel: ChannelNumber
}

export interface ChannelVoiceProps extends ChannelMessageProps {
  messageType: 'Voice'
}

export interface ChannelModeProps extends ChannelMessageProps {
  messageType: 'Mode'
}

export type NoteOff = ChannelVoiceProps &
  Pitch & {
    messageAction: 'Note Off'
    channel: ChannelNumber
    noteNumber: DataByte
  }

export type NoteOn = ChannelVoiceProps &
  Pitch & {
    messageAction: 'Note On'
    channel: ChannelNumber
    noteNumber: DataByte
    velocity: Exclude<DataByte, 0>
  }

export type PolyphonicKeyPressure = ChannelVoiceProps &
  Pitch & {
    messageAction: 'Polyphonic Key Pressure'
    channel: ChannelNumber
    noteNumber: DataByte
    aftertouch: DataByte
  }

export interface ProgramChange extends ChannelVoiceProps {
  messageAction: 'Program Change'
  channel: ChannelNumber
  program: DataByte
}

export interface ChannelPressure extends ChannelVoiceProps {
  messageAction: 'Channel Pressure'
  channel: ChannelNumber
  aftertouch: DataByte
}

export interface PitchBend extends ChannelVoiceProps {
  messageAction: 'Pitch Bend'
  channel: ChannelNumber
  pitchBend: MultiByteValue
}

export type ChannelVoiceMessage =
  | NoteOff
  | NoteOn
  | PolyphonicKeyPressure
  | ProgramChange
  | ChannelPressure
  | ControlChangeMessage
  | PitchBend

export type ChannelMessage = ChannelVoiceMessage | ChannelModeProps

export interface ChannelState {
  number: ChannelNumber
  notes: Map<NoteNumber, NoteState>
  aftertouch: DataByte
  pitchBend: MultiByteValue
  program: ProgramState
  controls: ChannelControlState
  mode: { omni: boolean; mono: boolean }
}

export type ChannelStateJSON = Omit<ChannelState, 'notes'> & {
  notes: {
    [key in NoteNumber]?: NoteState
  }
}
export interface ProgramState {
  program: DataByte
  bank: DataByte
  sound: DataByte
}
