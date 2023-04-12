import * as scales from '../src/scales'
import * as notes from '../src/notes'
import { describe, test, expect } from 'vitest'
import { accidentals, PitchClass, Step } from '../src/notes'

describe('test getScale function', () => {
  // T–T–S–T–T–T–S
  const majorScales: Array<[notes.PitchClass, notes.PitchClass[]]> = [
    [
      { step: 'C' },
      [
        { step: 'C' },
        { step: 'D' },
        { step: 'E' },
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
        { step: 'B' },
      ],
    ],
    [
      { step: 'G' },
      [
        { step: 'G' },
        { step: 'A' },
        { step: 'B' },
        { step: 'C' },
        { step: 'D' },
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'D' },
      [
        { step: 'D' },
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G' },
        { step: 'A' },
        { step: 'B' },
        { step: 'C', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'A' },
      [
        { step: 'A' },
        { step: 'B' },
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D' },
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'E' },
      [
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
        { step: 'A' },
        { step: 'B' },
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'B' },
      [
        { step: 'B' },
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D', alter: notes.accidentals.sharp },
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
        { step: 'A', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'F', alter: notes.accidentals.sharp },
      [
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
        { step: 'A', alter: notes.accidentals.sharp },
        { step: 'B' },
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D', alter: notes.accidentals.sharp },
        { step: 'E', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'C', alter: notes.accidentals.sharp },
      [
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D', alter: notes.accidentals.sharp },
        { step: 'E', alter: notes.accidentals.sharp },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
        { step: 'A', alter: notes.accidentals.sharp },
        { step: 'B', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'F' },
      [
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C' },
        { step: 'D' },
        { step: 'E' },
      ],
    ],
    [
      { step: 'B', alter: notes.accidentals.flat },
      [
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C' },
        { step: 'D' },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
      ],
    ],
    [
      { step: 'E', alter: notes.accidentals.flat },
      [
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G' },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C' },
        { step: 'D' },
      ],
    ],
    [
      { step: 'A', alter: notes.accidentals.flat },
      [
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C' },
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G' },
      ],
    ],
    [
      { step: 'D', alter: notes.accidentals.flat },
      [
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G', alter: notes.accidentals.flat },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C' },
      ],
    ],
    [
      { step: 'G', alter: notes.accidentals.flat },
      [
        { step: 'G', alter: notes.accidentals.flat },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C', alter: notes.accidentals.flat },
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
      ],
    ],
    [
      { step: 'C', alter: notes.accidentals.flat },
      [
        { step: 'C', alter: notes.accidentals.flat },
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F', alter: notes.accidentals.flat },
        { step: 'G', alter: notes.accidentals.flat },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
      ],
    ],
  ]

  test.each(majorScales)(
    'test major scales getScale(%s) -> %s',
    (note, expected) => {
      expect(scales.getScale(note).notes).toEqual(expected)
    }
  )

  // T–S–T–T–S–T–T
  const minorScales: Array<[notes.PitchClass, notes.PitchClass[]]> = [
    [
      { step: 'A' },
      [
        { step: 'A' },
        { step: 'B' },
        { step: 'C' },
        { step: 'D' },
        { step: 'E' },
        { step: 'F' },
        { step: 'G' },
      ],
    ],
    [
      { step: 'E' },
      [
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G' },
        { step: 'A' },
        { step: 'B' },
        { step: 'C' },
        { step: 'D' },
      ],
    ],
    [
      { step: 'B' },
      [
        { step: 'B' },
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D' },
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G' },
        { step: 'A' },
      ],
    ],
    [
      { step: 'F', alter: notes.accidentals.sharp },
      [
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
        { step: 'A' },
        { step: 'B' },
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D' },
        { step: 'E' },
      ],
    ],
    [
      { step: 'C', alter: notes.accidentals.sharp },
      [
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D', alter: notes.accidentals.sharp },
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
        { step: 'A' },
        { step: 'B' },
      ],
    ],
    [
      { step: 'G', alter: notes.accidentals.sharp },
      [
        { step: 'G', alter: notes.accidentals.sharp },
        { step: 'A', alter: notes.accidentals.sharp },
        { step: 'B' },
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D', alter: notes.accidentals.sharp },
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'D', alter: notes.accidentals.sharp },
      [
        { step: 'D', alter: notes.accidentals.sharp },
        { step: 'E', alter: notes.accidentals.sharp },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
        { step: 'A', alter: notes.accidentals.sharp },
        { step: 'B' },
        { step: 'C', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'A', alter: notes.accidentals.sharp },
      [
        { step: 'A', alter: notes.accidentals.sharp },
        { step: 'B', alter: notes.accidentals.sharp },
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D', alter: notes.accidentals.sharp },
        { step: 'E', alter: notes.accidentals.sharp },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
      ],
    ],
    [
      { step: 'D' },
      [
        { step: 'D' },
        { step: 'E' },
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C' },
      ],
    ],
    [
      { step: 'G' },
      [
        { step: 'G' },
        { step: 'A' },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C' },
        { step: 'D' },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
      ],
    ],
    [
      { step: 'C' },
      [
        { step: 'C' },
        { step: 'D' },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G' },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
      ],
    ],
    [
      { step: 'F' },
      [
        { step: 'F' },
        { step: 'G' },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C' },
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
      ],
    ],
    [
      { step: 'B', alter: notes.accidentals.flat },
      [
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C' },
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G', alter: notes.accidentals.flat },
        { step: 'A', alter: notes.accidentals.flat },
      ],
    ],
    [
      { step: 'E', alter: notes.accidentals.flat },
      [
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G', alter: notes.accidentals.flat },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C', alter: notes.accidentals.flat },
        { step: 'D', alter: notes.accidentals.flat },
      ],
    ],
    [
      { step: 'A', alter: notes.accidentals.flat },
      [
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C', alter: notes.accidentals.flat },
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F', alter: notes.accidentals.flat },
        { step: 'G', alter: notes.accidentals.flat },
      ],
    ],
  ]

  test.each(minorScales)(
    'test minor scales getScale(%s) -> %s',
    (note, expected) => {
      expect(scales.getScale(note, 'minor').notes).toEqual(expected)
    }
  )

  // T–S–T–T–T–S–T
  const dorianScales: Array<[notes.PitchClass, notes.PitchClass[]]> = [
    [
      { step: 'C' },
      [
        { step: 'C' },
        { step: 'D' },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
        { step: 'B', alter: notes.accidentals.flat },
      ],
    ],
    [
      { step: 'C', alter: notes.accidentals.sharp },
      [
        { step: 'C', alter: notes.accidentals.sharp },
        { step: 'D', alter: notes.accidentals.sharp },
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G', alter: notes.accidentals.sharp },
        { step: 'A', alter: notes.accidentals.sharp },
        { step: 'B' },
      ],
    ],
    [
      { step: 'D', alter: notes.accidentals.flat },
      [
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F', alter: notes.accidentals.flat },
        { step: 'G', alter: notes.accidentals.flat },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
        { step: 'C', alter: notes.accidentals.flat },
      ],
    ],
    [
      { step: 'D' },
      [
        { step: 'D' },
        { step: 'E' },
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
        { step: 'B' },
        { step: 'C' },
      ],
    ],
  ]

  test.each(dorianScales)(
    'test dorian scales getScale(%s) -> %s',
    (note, expected) => {
      expect(scales.getScale(note, 'dorian').notes).toEqual(expected)
    }
  )

  // S–T–T–T–S–T–T
  const phrygianScales: Array<[notes.PitchClass, notes.PitchClass[]]> = [
    [
      { step: 'C' },
      [
        { step: 'C' },
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G' },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
      ],
    ],
    [
      { step: 'E' },
      [
        { step: 'E' },
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
        { step: 'B' },
        { step: 'C' },
        { step: 'D' },
      ],
    ],
    [
      { step: 'D', alter: accidentals.flat },
      [
        { step: 'D', alter: accidentals.flat },
        { step: 'E', alter: accidentals.doubleFlat },
        { step: 'F', alter: accidentals.flat },
        { step: 'G', alter: accidentals.flat },
        { step: 'A', alter: accidentals.flat },
        { step: 'B', alter: accidentals.doubleFlat },
        { step: 'C', alter: accidentals.flat },
      ],
    ],
  ]

  test.each(phrygianScales)(
    'test Phrygian scales getScale(%s) -> %s',
    (note, expected) => {
      expect(scales.getScale(note, 'phrygian').notes).toEqual(expected)
    }
  )

  // S–T–T–T–S–T–T
  const lydianScales: Array<[notes.PitchClass, notes.PitchClass[]]> = [
    [
      { step: 'C' },
      [
        { step: 'C' },
        { step: 'D' },
        { step: 'E' },
        { step: 'F', alter: notes.accidentals.sharp },
        { step: 'G' },
        { step: 'A' },
        { step: 'B' },
      ],
    ],
    [
      { step: 'F' },
      [
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
        { step: 'B' },
        { step: 'C' },
        { step: 'D' },
        { step: 'E' },
      ],
    ],
  ]

  test.each(lydianScales)(
    'test lydian scales getScale(%s) -> %s',
    (note, expected) => {
      expect(scales.getScale(note, 'lydian').notes).toEqual(expected)
    }
  )

  // T–T–S–T–T–S–T
  const mixolydianScales: Array<[notes.PitchClass, notes.PitchClass[]]> = [
    [
      { step: 'C' },
      [
        { step: 'C' },
        { step: 'D' },
        { step: 'E' },
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
        { step: 'B', alter: notes.accidentals.flat },
      ],
    ],
    [
      { step: 'G' },
      [
        { step: 'G' },
        { step: 'A' },
        { step: 'B' },
        { step: 'C' },
        { step: 'D' },
        { step: 'E' },
        { step: 'F' },
      ],
    ],
  ]

  test.each(mixolydianScales)(
    'test mixolydian scales getScale(%s) -> %s',
    (note, expected) => {
      expect(scales.getScale(note, 'mixolydian').notes).toEqual(expected)
    }
  )

  // S–T–T–S–T–T–T
  const locrianScales: Array<[notes.PitchClass, notes.PitchClass[]]> = [
    [
      { step: 'C' },
      [
        { step: 'C' },
        { step: 'D', alter: notes.accidentals.flat },
        { step: 'E', alter: notes.accidentals.flat },
        { step: 'F' },
        { step: 'G', alter: notes.accidentals.flat },
        { step: 'A', alter: notes.accidentals.flat },
        { step: 'B', alter: notes.accidentals.flat },
      ],
    ],
    [
      { step: 'B' },
      [
        { step: 'B' },
        { step: 'C' },
        { step: 'D' },
        { step: 'E' },
        { step: 'F' },
        { step: 'G' },
        { step: 'A' },
      ],
    ],
  ]

  test.each(locrianScales)(
    'test locrian scales getScale(%s) -> %s',
    (note, expected) => {
      expect(scales.getScale(note, 'locrian').notes).toEqual(expected)
    }
  )
})

describe('test getKey function', () => {
  const majors: [number, PitchClass][] = [
    [0, { step: 'C' }],
    [1, { step: 'G' }],
    [-1, { step: 'F' }],
    [2, { step: 'D' }],
    [-2, { step: 'B', alter: accidentals.flat }],
    [3, { step: 'A' }],
    [-3, { step: 'E', alter: accidentals.flat }],
    [4, { step: 'E' }],
    [-4, { step: 'A', alter: accidentals.flat }],
    [5, { step: 'B' }],
    [-5, { step: 'D', alter: accidentals.flat }],
    [6, { step: 'F', alter: accidentals.sharp }],
    [-6, { step: 'G', alter: accidentals.flat }],
    [7, { step: 'C', alter: accidentals.sharp }],
    [-7, { step: 'C', alter: accidentals.flat }],
  ]

  test.each(majors)('test major keys getKey(%i) -> %s', (fifths, expected) => {
    expect(scales.getKey(fifths).tonic).toEqual(expected)
  })

  const minors: [number, PitchClass][] = [
    [0, { step: 'A' }],
    [1, { step: 'E' }],
    [-1, { step: 'D' }],
    [2, { step: 'B' }],
    [-2, { step: 'G' }],
    [3, { step: 'F', alter: accidentals.sharp }],
    [-3, { step: 'C' }],
    [4, { step: 'C', alter: accidentals.sharp }],
    [-4, { step: 'F' }],
    [5, { step: 'G', alter: accidentals.sharp }],
    [-5, { step: 'B', alter: accidentals.flat }],
    [6, { step: 'D', alter: accidentals.sharp }],
    [-6, { step: 'E', alter: accidentals.flat }],
    [7, { step: 'A', alter: accidentals.sharp }],
    [-7, { step: 'A', alter: accidentals.flat }],
  ]

  test.each(minors)('test minor keys getKey(%i) -> %s', (fifths, expected) => {
    expect(scales.getKey(fifths, 'minor').tonic).toEqual(expected)
  })

  const dorian: [number, PitchClass][] = [
    [0, { step: 'D' }],
    [1, { step: 'A' }],
    [-1, { step: 'G' }],
    [2, { step: 'E' }],
    [-2, { step: 'C' }],
    [3, { step: 'B' }],
    [-3, { step: 'F' }],
    [4, { step: 'F', alter: accidentals.sharp }],
    [-4, { step: 'B', alter: accidentals.flat }],
    [5, { step: 'C', alter: accidentals.sharp }],
    [-5, { step: 'E', alter: accidentals.flat }],
    [6, { step: 'G', alter: accidentals.sharp }],
    [-6, { step: 'A', alter: accidentals.flat }],
    [7, { step: 'D', alter: accidentals.sharp }],
    [-7, { step: 'D', alter: accidentals.flat }],
  ]

  test.each(dorian)('test dorian keys getKey(%i) -> %s', (fifths, expected) => {
    expect(scales.getKey(fifths, 'dorian').tonic).toEqual(expected)
  })

  const phrygian: [number, PitchClass][] = [
    [0, { step: 'E' }],
    [1, { step: 'B' }],
    [-1, { step: 'A' }],
    [2, { step: 'F', alter: accidentals.sharp }],
    [-2, { step: 'D' }],
    [3, { step: 'C', alter: accidentals.sharp }],
    [-3, { step: 'G' }],
    [4, { step: 'G', alter: accidentals.sharp }],
    [-4, { step: 'C' }],
    [5, { step: 'D', alter: accidentals.sharp }],
    [-5, { step: 'F' }],
    [6, { step: 'A', alter: accidentals.sharp }],
    [-6, { step: 'B', alter: accidentals.flat }],
    [7, { step: 'E', alter: accidentals.sharp }],
    [-7, { step: 'E', alter: accidentals.flat }],
  ]

  test.each(phrygian)(
    'test phrygian keys getKey(%i) -> %s',
    (fifths, expected) => {
      expect(scales.getKey(fifths, 'phrygian').tonic).toEqual(expected)
    }
  )
})
