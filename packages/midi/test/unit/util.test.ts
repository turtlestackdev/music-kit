import { describe, test, expect } from 'vitest'
import * as util from '../../src/util'
import type { DataByte, MultiByteValue } from '../../src/message.types'
import { isDataByte, isMultiByteValue } from '../../src/message'

describe('test MultiByteValue calculations', () => {
  test('all DataByte values should calculate to msb * 128 + lsb', () => {
    let msb: DataByte = 0
    let expected: MultiByteValue = 0
    let actual: MultiByteValue = 0
    while (isDataByte(msb)) {
      let lsb: DataByte = 0
      while (isDataByte(lsb)) {
        actual = util.calculateMultiByteValue(msb, lsb)
        expect(actual).toEqual(expected)
        expected++
        lsb++
      }
      msb++
    }
    expect(actual).toEqual(16383)

    // Spot check a few specific values
    expect(util.calculateMultiByteValue(0, 0)).toEqual(0)
    expect(util.calculateMultiByteValue(64, 0)).toEqual(8192)
    expect(util.calculateMultiByteValue(100, 33)).toEqual(12833)
    expect(util.calculateMultiByteValue(127, 127)).toEqual(16383)
  })

  test('all multibyte values are correctly resolved to msb/lsb', () => {
    let value: MultiByteValue = 0
    let [expectedMsb, expectedLsb]: [DataByte, DataByte] = [0, 0]
    let [actualMsb, actualLsb]: [number, number] = [0, 0]
    while (isMultiByteValue(value)) {
      ;[actualMsb, actualLsb] = util.getMsbAndLsb(value)
      expect([actualMsb, actualLsb]).toEqual([expectedMsb, expectedLsb])
      if (expectedLsb < 127) {
        expectedLsb++
      } else {
        expectedLsb = 0
        expectedMsb++
      }
      value++
    }

    expect([actualMsb, actualLsb]).toEqual([127, 127])

    // Spot check a few specific values
    expect(util.getMsbAndLsb(0)).toEqual([0, 0])
    expect(util.getMsbAndLsb(8192)).toEqual([64, 0])
    expect(util.getMsbAndLsb(12833)).toEqual([100, 33])
    expect(util.getMsbAndLsb(16383)).toEqual([127, 127])
  })
})
