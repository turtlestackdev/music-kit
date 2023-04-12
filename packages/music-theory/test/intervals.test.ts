import * as intervals from '../src/intervals'
import { describe, test, expect } from 'vitest'
import { accidentals, PitchClass } from '../src/notes'
describe('test transpose function', () => {
  const ascendingFifths: [PitchClass, PitchClass][] = [
    [{ step: 'C' }, { step: 'G' }],
    [
      { step: 'C', alter: accidentals.sharp },
      { step: 'G', alter: accidentals.sharp },
    ],
    [
      { step: 'D', alter: accidentals.flat },
      { step: 'A', alter: accidentals.flat },
    ],
    [{ step: 'D' }, { step: 'A' }],
    [
      { step: 'D', alter: accidentals.sharp },
      { step: 'A', alter: accidentals.sharp },
    ],
    [
      { step: 'E', alter: accidentals.flat },
      { step: 'B', alter: accidentals.flat },
    ],
    [{ step: 'E' }, { step: 'B' }],
    [{ step: 'F' }, { step: 'C' }],
    [
      { step: 'F', alter: accidentals.sharp },
      { step: 'C', alter: accidentals.sharp },
    ],
    [
      { step: 'G', alter: accidentals.flat },
      { step: 'D', alter: accidentals.flat },
    ],
    [{ step: 'G' }, { step: 'D' }],
    [
      { step: 'G', alter: accidentals.sharp },
      { step: 'D', alter: accidentals.sharp },
    ],
    [
      { step: 'A', alter: accidentals.flat },
      { step: 'E', alter: accidentals.flat },
    ],
    [{ step: 'A' }, { step: 'E' }],
    [
      { step: 'A', alter: accidentals.sharp },
      { step: 'E', alter: accidentals.sharp },
    ],
    [{ step: 'B', alter: accidentals.flat }, { step: 'F' }],
    [{ step: 'B' }, { step: 'F', alter: accidentals.sharp }],
  ]

  test.each(ascendingFifths)('P5 transpose(%s) -> %s', (pitch, expected) => {
    expect(intervals.transpose(pitch, intervals.P5)).toEqual(expected)
  })

  const descendingFifths: [PitchClass, PitchClass][] = [
    [{ step: 'C' }, { step: 'F' }],
    [{ step: 'B' }, { step: 'E' }],
    [
      { step: 'B', alter: accidentals.flat },
      { step: 'E', alter: accidentals.flat },
    ],
    [
      { step: 'A', alter: accidentals.sharp },
      { step: 'D', alter: accidentals.sharp },
    ],
    [{ step: 'A' }, { step: 'D' }],
    [
      { step: 'A', alter: accidentals.flat },
      { step: 'D', alter: accidentals.flat },
    ],
    [
      { step: 'G', alter: accidentals.sharp },
      { step: 'C', alter: accidentals.sharp },
    ],
    [{ step: 'G' }, { step: 'C' }],
    [
      { step: 'G', alter: accidentals.flat },
      { step: 'C', alter: accidentals.flat },
    ],
    [{ step: 'F', alter: accidentals.sharp }, { step: 'B' }],
    [{ step: 'F' }, { step: 'B', alter: accidentals.flat }],
    [
      { step: 'E', alter: accidentals.sharp },
      { step: 'A', alter: accidentals.sharp },
    ],
    [{ step: 'E' }, { step: 'A' }],
    [
      { step: 'E', alter: accidentals.flat },
      { step: 'A', alter: accidentals.flat },
    ],
    [
      { step: 'D', alter: accidentals.sharp },
      { step: 'G', alter: accidentals.sharp },
    ],
    [{ step: 'D' }, { step: 'G' }],
    [
      { step: 'D', alter: accidentals.flat },
      { step: 'G', alter: accidentals.flat },
    ],
    [
      { step: 'C', alter: accidentals.sharp },
      { step: 'F', alter: accidentals.sharp },
    ],
  ]
  test.each(descendingFifths)(
    'P5 transpose(%s, down) -> %s',
    (pitch, expected) => {
      expect(intervals.transpose(pitch, intervals.P5, 'down')).toEqual(expected)
    }
  )
})
