export * from './control.types'
import type {
  ControlChangeMessage,
  ControlNumber,
  MultiByteControlLSB,
  MultiByteControlMSB,
  NRPN_LSB,
  NRPN_MSB,
  RegisteredParameterNumber,
  RPN_LSB,
  RPN_MSB,
  SingleByteControlNumber,
  SwitchControlNumber,
} from './control.types'
import type { DataByte, UndefinedMessage } from './message.types'
import type { ChannelNumber } from './channel.types'

export const controlLabels = [
  { label: 'bankSelect', controlNumber: 0 },
  { label: 'modulationWheel', controlNumber: 1 },
  { label: 'breathController', controlNumber: 2 },
  { label: 'undefined', controlNumber: 3 },
  { label: 'footController', controlNumber: 4 },
  { label: 'portamentoTime', controlNumber: 5 },
  { label: 'dataEntry', controlNumber: 6 },
  { label: 'channelVolume', controlNumber: 7 },
  { label: 'balance', controlNumber: 8 },
  { label: 'undefined', controlNumber: 9 },
  { label: 'pan', controlNumber: 10 },
  { label: 'expressionController', controlNumber: 11 },
  { label: 'effectControl1', controlNumber: 12 },
  { label: 'effectControl2', controlNumber: 13 },
  { label: 'undefined', controlNumber: 14 },
  { label: 'undefined', controlNumber: 15 },
  { label: 'generalPurpose1', controlNumber: 16 },
  { label: 'generalPurpose2', controlNumber: 17 },
  { label: 'generalPurpose3', controlNumber: 18 },
  { label: 'generalPurpose4', controlNumber: 19 },
  { label: 'undefined', controlNumber: 20 },
  { label: 'undefined', controlNumber: 21 },
  { label: 'undefined', controlNumber: 22 },
  { label: 'undefined', controlNumber: 23 },
  { label: 'undefined', controlNumber: 24 },
  { label: 'undefined', controlNumber: 25 },
  { label: 'undefined', controlNumber: 26 },
  { label: 'undefined', controlNumber: 27 },
  { label: 'undefined', controlNumber: 28 },
  { label: 'undefined', controlNumber: 29 },
  { label: 'undefined', controlNumber: 30 },
  { label: 'undefined', controlNumber: 31 },
  { label: 'bankSelect', controlNumber: 0 },
  { label: 'modulationWheel', controlNumber: 1 },
  { label: 'breathController', controlNumber: 2 },
  { label: 'undefined', controlNumber: 3 },
  { label: 'footController', controlNumber: 4 },
  { label: 'portamentoTime', controlNumber: 5 },
  { label: 'dataEntry', controlNumber: 6 },
  { label: 'channelVolume', controlNumber: 7 },
  { label: 'balance', controlNumber: 8 },
  { label: 'undefined', controlNumber: 9 },
  { label: 'pan', controlNumber: 10 },
  { label: 'expressionController', controlNumber: 11 },
  { label: 'effectControl1', controlNumber: 12 },
  { label: 'effectControl2', controlNumber: 13 },
  { label: 'undefined', controlNumber: 14 },
  { label: 'undefined', controlNumber: 15 },
  { label: 'generalPurpose1', controlNumber: 16 },
  { label: 'generalPurpose2', controlNumber: 17 },
  { label: 'generalPurpose3', controlNumber: 18 },
  { label: 'generalPurpose4', controlNumber: 19 },
  { label: 'undefined', controlNumber: 20 },
  { label: 'undefined', controlNumber: 21 },
  { label: 'undefined', controlNumber: 22 },
  { label: 'undefined', controlNumber: 23 },
  { label: 'undefined', controlNumber: 24 },
  { label: 'undefined', controlNumber: 25 },
  { label: 'undefined', controlNumber: 26 },
  { label: 'undefined', controlNumber: 27 },
  { label: 'undefined', controlNumber: 28 },
  { label: 'undefined', controlNumber: 29 },
  { label: 'undefined', controlNumber: 30 },
  { label: 'undefined', controlNumber: 31 },
  { label: 'damperPedal', controlNumber: 64 },
  { label: 'portamentoToggle', controlNumber: 65 },
  { label: 'sostenutoPedal', controlNumber: 66 },
  { label: 'softPedal', controlNumber: 67 },
  { label: 'legatoFootswitch', controlNumber: 68 },
  { label: 'hold2', controlNumber: 69 },
  { label: 'soundVariation', controlNumber: 70 },
  { label: 'timbreHarmonicIntensity', controlNumber: 71 },
  { label: 'releaseTime', controlNumber: 72 },
  { label: 'attackTime', controlNumber: 73 },
  { label: 'brightness', controlNumber: 74 },
  { label: 'soundController6', controlNumber: 75 },
  { label: 'soundController7', controlNumber: 76 },
  { label: 'soundController8', controlNumber: 77 },
  { label: 'soundController9', controlNumber: 78 },
  { label: 'soundController10', controlNumber: 79 },
  { label: 'generalPurpose5', controlNumber: 80 },
  { label: 'generalPurpose6', controlNumber: 81 },
  { label: 'generalPurpose7', controlNumber: 82 },
  { label: 'generalPurpose9', controlNumber: 83 },
  { label: 'portamentoControl', controlNumber: 84 },
  { label: 'undefined', controlNumber: 85 },
  { label: 'undefined', controlNumber: 86 },
  { label: 'undefined', controlNumber: 87 },
  { label: 'undefined', controlNumber: 88 },
  { label: 'undefined', controlNumber: 89 },
  { label: 'undefined', controlNumber: 90 },
  { label: 'effects1Depth', controlNumber: 91 },
  { label: 'effects2Depth', controlNumber: 92 },
  { label: 'effects3Depth', controlNumber: 93 },
  { label: 'effects4Depth', controlNumber: 94 },
  { label: 'effects5Depth', controlNumber: 95 },
  { label: 'dataIncrement', controlNumber: 96 },
  { label: 'dataDecrement', controlNumber: 97 },
  { label: 'nonRegisteredParameterNumberLSB', controlNumber: 98 },
  { label: 'nonRegisteredParameterNumberMSB', controlNumber: 99 },
  { label: 'registeredParameterNumberLSB', controlNumber: 100 },
  { label: 'registeredParameterNumberMSB', controlNumber: 101 },
  { label: 'undefined', controlNumber: 102 },
  { label: 'undefined', controlNumber: 103 },
  { label: 'undefined', controlNumber: 104 },
  { label: 'undefined', controlNumber: 105 },
  { label: 'undefined', controlNumber: 106 },
  { label: 'undefined', controlNumber: 107 },
  { label: 'undefined', controlNumber: 108 },
  { label: 'undefined', controlNumber: 109 },
  { label: 'undefined', controlNumber: 110 },
  { label: 'undefined', controlNumber: 111 },
  { label: 'undefined', controlNumber: 112 },
  { label: 'undefined', controlNumber: 113 },
  { label: 'undefined', controlNumber: 114 },
  { label: 'undefined', controlNumber: 115 },
  { label: 'undefined', controlNumber: 116 },
  { label: 'undefined', controlNumber: 117 },
  { label: 'undefined', controlNumber: 118 },
  { label: 'undefined', controlNumber: 119 },
] as const

export function isControlNumber(value: number): value is ControlNumber {
  // We do not count the LSB of a multibyte control as a control number
  return Number.isInteger(value) && value >= 0 && value <= 119
}

export const undefinedControlNumbers = [
  3, 9, 14, 15, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 85, 86, 87, 88,
  89, 90, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
  116, 117, 118, 119,
] as const

export function isSingleByteControlNumber(
  value: number
): value is SingleByteControlNumber {
  return Number.isInteger(value) && value >= 70 && value <= 119
}

export function isSwitchControlNumber(
  value: number
): value is SwitchControlNumber {
  return Number.isInteger(value) && value >= 64 && value <= 69
}

export function isMultiByteControlMSB(
  value: DataByte
): value is MultiByteControlMSB {
  return Number.isInteger(value) && value >= 0 && value <= 31
}

export function isMultiByteControlLSB(
  value: DataByte
): value is MultiByteControlLSB {
  return Number.isInteger(value) && value >= 32 && value <= 63
}

export function isNonRegisteredLSB(control: DataByte): control is NRPN_LSB {
  return control === 98
}

export function isNonRegisteredMSB(control: DataByte): control is NRPN_MSB {
  return control === 99
}

export function isRegisteredLSB(control: DataByte): control is RPN_LSB {
  return control === 100
}

export function isRegisteredMSB(control: DataByte): control is RPN_MSB {
  return control === 101
}

export function isRegisteredParameterNumber(
  value: DataByte
): value is RegisteredParameterNumber {
  return Number.isInteger(value) && value >= 0 && value <= 4
}

export function parseMessage(
  channel: ChannelNumber,
  control: ControlNumber,
  value: DataByte
): ControlChangeMessage | UndefinedMessage {
  const details = {
    messageCategory: 'Channel',
    messageType: 'Voice',
    messageAction: 'Control Change',
    channel: channel,
  } as const

  if (isMultiByteControlMSB(control)) {
    return {
      ...details,
      ...controlLabels[control],
      controlType: 'multiByte',
      props: { msb: value, lsb: 0 },
    }
  } else if (isMultiByteControlLSB(control)) {
    return {
      ...details,
      ...controlLabels[control],
      controlType: 'multiByte',
      props: { lsb: value },
    }
  } else if (isSwitchControlNumber(control)) {
    return {
      ...details,
      ...controlLabels[control],
      controlType: 'switch',
      props: { enabled: value >= 64 },
    }
  } else if (isSingleByteControlNumber(control)) {
    if (isRegisteredLSB(control) && !isRegisteredParameterNumber(value)) {
      return {}
    }

    return {
      ...details,
      ...controlLabels[control],
      controlType: 'singleByte',
      props: { value: value },
    }
  }

  return {}
}
