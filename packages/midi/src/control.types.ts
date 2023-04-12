import type { DataByte, MultiByteValue } from './message.types'
import type { controlLabels, undefinedControlNumbers } from './control'
import type { ChannelVoiceProps } from './channel.types'

export type ControlNumber =
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
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63
  | 64
  | 65
  | 66
  | 67
  | 68
  | 69
  | 70
  | 71
  | 72
  | 73
  | 74
  | 75
  | 76
  | 77
  | 78
  | 79
  | 80
  | 81
  | 82
  | 83
  | 84
  | 85
  | 86
  | 87
  | 88
  | 89
  | 90
  | 91
  | 92
  | 93
  | 94
  | 95
  | 96
  | 97
  | 98
  | 99
  | 100
  | 101
  | 102
  | 103
  | 104
  | 105
  | 106
  | 107
  | 108
  | 109
  | 110
  | 111
  | 112
  | 113
  | 114
  | 115
  | 116
  | 117
  | 118
  | 119

export type SwitchControlNumber = 64 | 65 | 66 | 67 | 68 | 69

export type SingleByteControlNumber =
  | 70
  | 71
  | 72
  | 73
  | 74
  | 75
  | 76
  | 77
  | 78
  | 79
  | 80
  | 81
  | 82
  | 83
  | 84
  | 85
  | 86
  | 87
  | 88
  | 89
  | 90
  | 91
  | 92
  | 93
  | 94
  | 95
  | 96
  | 97
  | 98
  | 99
  | 100
  | 101
  | 102
  | 103
  | 104
  | 105
  | 106
  | 107
  | 108
  | 109
  | 110
  | 111
  | 112
  | 113
  | 114
  | 115
  | 116
  | 117
  | 118
  | 119

export type MultiByteControlMSB =
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
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31

export type MultiByteControlLSB =
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63

export type RegisteredParameterNumber = 0 | 1 | 2 | 3 | 4

export type UndefinedControlNumber = (typeof undefinedControlNumbers)[number]

export type ControlDefinition<T extends ControlNumber> =
  (typeof controlLabels)[T]

export type ControlChange<
  T extends Exclude<ControlNumber, MultiByteControlLSB>
> = ChannelVoiceProps &
  ControlDefinition<T> & {
    messageAction: 'Control Change'
  }

export type MultiByteControlValue =
  | {
      msb: DataByte
      // reset lsb to 0 on msb message
      lsb: Extract<DataByte, 0>
    }
  | {
      // typescript was complaining whenever we attempt to access msb on this type.
      // I would prefer to not have msb here. The type structure may need revisiting.
      msb?: undefined
      lsb: DataByte
    }

export type MultiByteControlLabel =
  (typeof controlLabels)[MultiByteControlMSB]['label']
export type MultiByteControl = ControlChange<MultiByteControlMSB> & {
  controlType: 'multiByte'
  props: MultiByteControlValue
}

export type SwitchControlLabel =
  (typeof controlLabels)[SwitchControlNumber]['label']
export type SwitchControl = ControlChange<SwitchControlNumber> & {
  controlType: 'switch'
  props: { enabled: boolean }
}

export type SingleByteControlLabel =
  (typeof controlLabels)[SingleByteControlNumber]['label']
export type SingleByteControl = ControlChange<SingleByteControlNumber> & {
  controlType: 'singleByte'
  props: { value: DataByte }
}

export type NRPN_LSB = 98
export type NRPN_MSB = 99
export type RPN_LSB = 100
export type RPN_MSB = 101

export type nonRegisteredParameterControlLSB = ControlChange<NRPN_LSB> & {
  controlType: 'parameterNumberLSB'
  props: { lsb: DataByte }
}

export type ParameterControlMSB = ControlChange<NRPN_MSB | RPN_MSB> & {
  controlType: 'parameterNumberMSB'
  props: { msb: DataByte }
}

export type RegisteredParameterControlLSB = ControlChange<RPN_LSB> & {
  controlType: 'parameterNumberLSB'
  props: { lsb: RegisteredParameterNumber }
}

export type InvalidMessage = ControlChange<
  Exclude<ControlNumber, MultiByteControlLSB>
> & {
  label: 'invalid'
  controlType: 'invalid'
  props: { value: DataByte }
}

export type ControlChangeMessage =
  | MultiByteControl
  | SwitchControl
  | SingleByteControl
  | nonRegisteredParameterControlLSB
  | ParameterControlMSB
  | RegisteredParameterControlLSB
  | InvalidMessage

export interface MultiByteControlState {
  msb: DataByte
  lsb: DataByte
  value: MultiByteValue
}

export interface SingleByteControlState {
  value: DataByte
}

export type MultiByteStateList = {
  [key in Exclude<MultiByteControlLabel, 'undefined'>]?: MultiByteControlState
}

export type SwitchStateList = {
  [key in SwitchControlLabel]?: {
    enabled: boolean
  }
}

export type SingleByteStateList = {
  [key in Exclude<SingleByteControlLabel, 'undefined'>]?: SingleByteControlState
}

export type UndefinedStateList = {
  undefined: {
    [key in Extract<
      UndefinedControlNumber,
      MultiByteControlMSB
    >]?: MultiByteControlState
  }
} & {
  undefined: {
    [key in Extract<
      UndefinedControlNumber,
      SingleByteControlNumber
    >]?: SingleByteControlState
  }
}

export type RegisteredParameterState = {
  registeredParameters: {
    [key in
      | 'pitchBendSensitivity'
      | 'fineTuning'
      | 'coarseTuning'
      | 'tuningProgramSelect'
      | 'tuningBankSelect']?: MultiByteControlState
  }
}

export type NonRegisteredParameterState = {
  nonRegisteredParameters: {
    [key in MultiByteValue]?: MultiByteControlState
  }
}

export type ChannelControlState = MultiByteStateList &
  SwitchStateList &
  SingleByteStateList &
  UndefinedStateList &
  RegisteredParameterState &
  NonRegisteredParameterState

export type DamperOn = SwitchControl & {
  controlNumber: 64
  label: 'damperPedal'
  props: { enabled: true }
}

export type DamperOff = SwitchControl & {
  controlNumber: 64
  label: 'damperPedal'
  props: { enabled: false }
}

export type SostenutoOn = SwitchControl & {
  controlNumber: 66
  label: 'sostenutoPedal'
  props: { enabled: true }
}

export type SostenutoOff = SwitchControl & {
  controlNumber: 66
  label: 'sostenutoPedal'
  props: { enabled: false }
}
