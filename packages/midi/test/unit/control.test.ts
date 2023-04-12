import { describe, test, expect } from 'vitest'
import { isDataByte } from '../../src/message'
import * as control from '../../src/control'
import { isRegisteredParameterNumber } from '../../src/control'
import type { ChannelNumber } from '../../src/channel.types'

describe('test type guards', () => {
  test('test control number guards', () => {
    let value = 0
    while (isDataByte(value)) {
      const cn = control.isControlNumber(value)
      if (value >= 120) {
        expect(cn).toEqual(false)
      } else {
        expect(cn).toEqual(true)

        if ([0, 1, 2, 3, 4].indexOf(value) > -1) {
          expect(control.isRegisteredParameterNumber(value)).toEqual(true)
        } else {
          expect(control.isRegisteredParameterNumber(value)).toEqual(false)
        }
        if (value >= 0 && value <= 31) {
          expect(control.isMultiByteControlMSB(value)).toEqual(true)
        } else {
          expect(control.isMultiByteControlMSB(value)).toEqual(false)
        }

        if (value >= 32 && value <= 63) {
          expect(control.isMultiByteControlLSB(value)).toEqual(true)
        } else {
          expect(control.isMultiByteControlLSB(value)).toEqual(false)
        }

        if ([64, 65, 66, 67, 68, 69].indexOf(value) > -1) {
          expect(control.isSwitchControlNumber(value)).toEqual(true)
        } else {
          expect(control.isSwitchControlNumber(value)).toEqual(false)
        }

        if (value >= 70 && value <= 119) {
          expect(control.isSingleByteControlNumber(value)).toEqual(true)
        } else {
          expect(control.isSingleByteControlNumber(value)).toEqual(false)
        }

        if (value === 98) {
          expect(control.isNonRegisteredLSB(value)).toEqual(true)
        } else {
          expect(control.isNonRegisteredLSB(value)).toEqual(false)
        }

        if (value === 99) {
          expect(control.isNonRegisteredMSB(value)).toEqual(true)
        } else {
          expect(control.isNonRegisteredMSB(value)).toEqual(false)
        }

        if (value === 100) {
          expect(control.isRegisteredLSB(value)).toEqual(true)
        } else {
          expect(control.isRegisteredLSB(value)).toEqual(false)
        }

        if (value === 101) {
          expect(control.isRegisteredMSB(value)).toEqual(true)
        } else {
          expect(control.isRegisteredMSB(value)).toEqual(false)
        }
      }
      value++
    }
  })
})

describe('test control message parsing', () => {
  test('test message parsing', () => {
    let ctrl = 0
    while (control.isControlNumber(ctrl)) {
      const channel = Math.floor(Math.random() * 16) as ChannelNumber
      let value = 0
      while (isDataByte(value)) {
        const msg = control.parseMessage(channel, ctrl, value)
        if (control.isRegisteredLSB(ctrl) && !isRegisteredParameterNumber(value)) {
          expect(msg).toEqual({})
        } else {
          expect(msg.messageCategory).toEqual('Channel')
          expect(msg.messageType).toEqual('Voice')
          expect(msg.messageAction).toEqual('Control Change')
          expect(msg.channel).toEqual(channel)

          if (!control.isMultiByteControlLSB(ctrl)) {
            expect(msg.controlNumber === ctrl)

            if (control.isMultiByteControlMSB(ctrl)) {
              expect(msg.controlType).toEqual('multiByte')
              expect(msg.props).toEqual({ msb: value, lsb: 0 })
            }

            if (control.isSwitchControlNumber(ctrl)) {
              expect(msg.controlType).toEqual('switch')
              expect(msg.props).toEqual({ enabled: value >= 64 })
            }

            if (control.isSingleByteControlNumber(ctrl)) {
              expect(msg.controlType).toEqual('singleByte')
              expect(msg.props).toEqual({ value: value })
            }
          } else {
            expect(msg.controlNumber === ctrl - 32)
            expect(msg.controlType).toEqual('multiByte')
            expect(msg.props).toEqual({ lsb: value })
          }

          expect(msg.label === control.controlLabels[ctrl].label)
        }
        value++
      }
      ctrl++
    }
  })
})
