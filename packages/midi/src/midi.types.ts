import type { ChannelState, ChannelNumber, ChannelStateJSON } from './channel.types'
import type { DataByte, MIDIMessage } from './message.types'

export interface Input {
  id: string
  manufacturer: string | null
  name: string | null
  version: string | null
  deviceState: MIDIPortDeviceState
  connectionState: MIDIPortConnectionState
  channels: Map<ChannelNumber, ChannelState>
  addStateChangeListener: (callback: (state: Input) => void) => void
  removeStateChangeListener: (callback: (state: Input) => void) => void
  addMessageListener: (callback: (msg: MIDIMessage) => void) => void
  removeMessageListener: (callback: (msg: MIDIMessage) => void) => void
  setState: (this: Input, state: { [key in keyof Input]?: Input[key] }) => void
  toJSON: () => InputJSON
}

// needed because a Map cannot be serialized, so channels needs special handling
// the reason channels isn't an ordinary object is that iterating objects often looses type safety.
export type InputJSON = Pick<Input, 'id' | 'manufacturer' | 'name' | 'version'> & {
  channels: {
    [key in ChannelNumber]?: ChannelStateJSON
  }
}

export type InputPendingChanges = Map<ChannelNumber, ChannelPendingChanges>

export type ChannelPendingChanges = {
  noteOff: Set<DataByte>
}
