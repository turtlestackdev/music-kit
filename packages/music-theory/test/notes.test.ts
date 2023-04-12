import * as notes from '../src/notes'
import { describe, test, expect } from 'vitest'
import type { Step } from '../src/notes'

describe('test toMIDINumber function', () => {
  const sharpTests: Array<[notes.Pitch, number | undefined]> = []
  const sharpTones: Array<notes.PitchClass> = [
    { step: 'C' },
    { step: 'C', alter: 1 },
    { step: 'D' },
    { step: 'D', alter: 1 },
    { step: 'E' },
    { step: 'F' },
    { step: 'F', alter: 1 },
    { step: 'G' },
    { step: 'G', alter: 1 },
    { step: 'A' },
    { step: 'A', alter: 1 },
    { step: 'B' },
  ]
  const flatTests: Array<[notes.Pitch, number | undefined]> = []
  const flatTones: Array<notes.PitchClass> = [
    { step: 'C' },
    { step: 'D', alter: -1 },
    { step: 'D' },
    { step: 'E', alter: -1 },
    { step: 'E' },
    { step: 'F' },
    { step: 'G', alter: -1 },
    { step: 'G' },
    { step: 'A', alter: -1 },
    { step: 'A' },
    { step: 'B', alter: -1 },
    { step: 'B' },
  ]
  let sharpExpected = 0
  let flatExpected = 0
  let octave = -1
  while (octave < 10) {
    for (const tone of sharpTones) {
      const pitch = { ...tone, octave }
      sharpTests.push([pitch, sharpExpected <= 127 ? sharpExpected : undefined])
      sharpExpected++
    }

    for (const tone of flatTones) {
      const pitch = { ...tone, octave }
      flatTests.push([pitch, flatExpected <= 127 ? flatExpected : undefined])
      flatExpected++
    }
    octave++
  }

  test.each(sharpTests)('naturals & sharps toMidiNote(%s) -> %s', (pitch, expected) => {
    expect(notes.toMIDINumber(pitch)).toEqual(expected)
  })

  test.each(flatTests)('naturals & flats toMidiNote(%s) -> %s', (pitch, expected) => {
    expect(notes.toMIDINumber(pitch)).toEqual(expected)
  })

  test('out of range pitches return undefined', () => {
    expect(notes.toMIDINumber({ step: 'A', octave: -2 })).toEqual(undefined)
    expect(notes.toMIDINumber({ step: 'G', alter: 1, octave: 9 })).toEqual(undefined)
    expect(notes.toMIDINumber({ step: 'C', alter: 0.25, octave: 4 })).toEqual(60)
    expect(notes.toMIDINumber({ step: 'C', alter: 0.5, octave: 4 })).toEqual(61)
    expect(notes.toMIDINumber({ step: 'C', alter: 0.75, octave: 4 })).toEqual(61)
  })

  const doubleSharps: Array<[notes.Pitch, number]> = [
    [{ step: 'C', alter: -2, octave: 4 }, 58],
    [{ step: 'D', alter: -2, octave: 4 }, 60],
    [{ step: 'E', alter: -2, octave: 4 }, 62],
    [{ step: 'F', alter: -2, octave: 4 }, 63],
    [{ step: 'G', alter: -2, octave: 4 }, 65],
    [{ step: 'A', alter: -2, octave: 4 }, 67],
    [{ step: 'B', alter: -2, octave: 4 }, 69],
  ]

  test.each(doubleSharps)('double sharps toMidiNote(%s) -> %i', (pitch, expected) => {
    expect(notes.toMIDINumber(pitch)).toEqual(expected)
  })

  const doubleFlats: Array<[notes.Pitch, number]> = [
    [{ step: 'C', alter: 2, octave: 4 }, 62],
    [{ step: 'D', alter: 2, octave: 4 }, 64],
    [{ step: 'F', alter: 2, octave: 4 }, 67],
    [{ step: 'G', alter: 2, octave: 4 }, 69],
    [{ step: 'A', alter: 2, octave: 4 }, 71],
    [{ step: 'B', alter: 2, octave: 4 }, 73],
  ]

  test.each(doubleFlats)('double flats toMidiNote(%s) -> %i', (pitch, expected) => {
    expect(notes.toMIDINumber(pitch)).toEqual(expected)
  })
})

describe('test fromMIDINumber function', () => {
  const tones: Array<notes.PitchClass> = [
    { step: 'C' },
    { step: 'C', alter: 1 },
    { step: 'D' },
    { step: 'D', alter: 1 },
    { step: 'E' },
    { step: 'F' },
    { step: 'F', alter: 1 },
    { step: 'G' },
    { step: 'G', alter: 1 },
    { step: 'A' },
    { step: 'A', alter: 1 },
    { step: 'B' },
  ]
  const tests: Array<[number, notes.Pitch]> = []
  let note = 0
  let octave = -1
  for (let i = 0; i < 128; i++) {
    tests.push([i, { ...tones[note], octave }])
    note++
    if (note > 11) {
      note = 0
      octave++
    }
  }

  test.each(tests)('fromMidiNote(%i) -> %s', (midiNumber, expected) => {
    expect(notes.fromMIDINumber(midiNumber)).toEqual(expected)
  })

  test('out of range numbers return undefined', () => {
    expect(notes.fromMIDINumber(-1)).toEqual(undefined)
    expect(notes.fromMIDINumber(128)).toEqual(undefined)
  })
})

describe('test shiftStep function', () => {
  test.each([
    ['A', 'B'],
    ['B', 'C'],
    ['C', 'D'],
    ['D', 'E'],
    ['E', 'F'],
    ['F', 'G'],
    ['G', 'A'],
  ])('increase shiftStep(%s) -> %s', (note, expected) => {
    expect(notes.stepShift(note as Step)).toEqual(expected)
  })

  test.each([
    ['A', 'G'],
    ['G', 'F'],
    ['F', 'E'],
    ['E', 'D'],
    ['D', 'C'],
    ['C', 'B'],
    ['B', 'A'],
  ])('decrease shiftStep(%s) -> %s', (note, expected) => {
    expect(notes.stepShift(note as Step, -1)).toEqual(expected)
  })

  test.each([
    [['A', 3], 'D'],
    [['G', 4], 'D'],
    [['F', 2], 'A'],
    [['E', -5], 'G'],
    [['D', -3], 'A'],
    [['C', -4], 'F'],
    [['B', -6], 'C'],
    [['D', 7], 'D'],
    [['E', -8], 'D'],
  ])('multiple steps shiftStep(%s) -> %s', (note, expected) => {
    expect(notes.stepShift(note[0] as Step, note[1] as number)).toEqual(expected)
  })
})

describe('test enharmonic function', () => {
  const noTarget: [notes.PitchClass, notes.PitchClass][] = [
    [
      { step: 'A', alter: notes.accidentals.sharp },
      { step: 'B', alter: notes.accidentals.flat },
    ],
    [
      { step: 'B', alter: notes.accidentals.flat },
      { step: 'A', alter: notes.accidentals.sharp },
    ],
    [
      { step: 'A', alter: notes.accidentals.doubleSharp },
      { step: 'B', alter: notes.accidentals.doubleFlat },
    ],
    [
      { step: 'B', alter: notes.accidentals.doubleFlat },
      { step: 'A', alter: notes.accidentals.doubleSharp },
    ],
    [
      { step: 'C', alter: notes.accidentals.sharp },
      { step: 'D', alter: notes.accidentals.flat },
    ],
    [
      { step: 'D', alter: notes.accidentals.flat },
      { step: 'C', alter: notes.accidentals.sharp },
    ],
    [
      { step: 'C', alter: notes.accidentals.doubleSharp },
      { step: 'D', alter: notes.accidentals.doubleFlat },
    ],
    [
      { step: 'D', alter: notes.accidentals.doubleFlat },
      { step: 'C', alter: notes.accidentals.doubleSharp },
    ],
    [
      { step: 'D', alter: notes.accidentals.sharp },
      { step: 'E', alter: notes.accidentals.flat },
    ],
    [
      { step: 'E', alter: notes.accidentals.flat },
      { step: 'D', alter: notes.accidentals.sharp },
    ],
    [
      { step: 'D', alter: notes.accidentals.doubleSharp },
      { step: 'E', alter: notes.accidentals.doubleFlat },
    ],
    [
      { step: 'E', alter: notes.accidentals.doubleFlat },
      { step: 'D', alter: notes.accidentals.doubleSharp },
    ],
    [
      { step: 'F', alter: notes.accidentals.sharp },
      { step: 'G', alter: notes.accidentals.flat },
    ],
    [
      { step: 'G', alter: notes.accidentals.flat },
      { step: 'F', alter: notes.accidentals.sharp },
    ],
    [
      { step: 'F', alter: notes.accidentals.doubleSharp },
      { step: 'G', alter: notes.accidentals.doubleFlat },
    ],
    [
      { step: 'G', alter: notes.accidentals.doubleFlat },
      { step: 'F', alter: notes.accidentals.doubleSharp },
    ],
    [
      { step: 'G', alter: notes.accidentals.sharp },
      { step: 'A', alter: notes.accidentals.flat },
    ],
    [
      { step: 'A', alter: notes.accidentals.flat },
      { step: 'G', alter: notes.accidentals.sharp },
    ],
    [
      { step: 'G', alter: notes.accidentals.doubleSharp },
      { step: 'A', alter: notes.accidentals.doubleFlat },
    ],
    [
      { step: 'A', alter: notes.accidentals.doubleFlat },
      { step: 'G', alter: notes.accidentals.doubleSharp },
    ],
    [{ step: 'A' }, { step: 'A' }],
    [{ step: 'B' }, { step: 'B' }],
    [{ step: 'C' }, { step: 'C' }],
    [{ step: 'D' }, { step: 'D' }],
    [{ step: 'E' }, { step: 'E' }],
    [{ step: 'F' }, { step: 'F' }],
    [{ step: 'G' }, { step: 'G' }],
  ]

  test.each(noTarget)('enharmonic(%s) -> %s', (note, expected) => {
    expect(notes.enharmonic(note)).toEqual(expected)
  })

  const withTarget: [[notes.PitchClass, Step], notes.PitchClass][] = [
    [
      [{ step: 'A', alter: notes.accidentals.sharp }, 'B'],
      { step: 'B', alter: notes.accidentals.flat },
    ],
    [
      [{ step: 'A', alter: notes.accidentals.sharp }, 'A'],
      { step: 'A', alter: notes.accidentals.sharp },
    ],
    [
      [{ step: 'B', alter: notes.accidentals.flat }, 'A'],
      { step: 'A', alter: notes.accidentals.sharp },
    ],
    [
      [{ step: 'B', alter: notes.accidentals.flat }, 'B'],
      { step: 'B', alter: notes.accidentals.flat },
    ],
    [
      [{ step: 'A', alter: notes.accidentals.doubleSharp }, 'B'],
      { step: 'B', alter: notes.accidentals.doubleFlat },
    ],
    [
      [{ step: 'A', alter: notes.accidentals.doubleSharp }, 'A'],
      { step: 'A', alter: notes.accidentals.doubleSharp },
    ],
    [
      [{ step: 'B', alter: notes.accidentals.doubleFlat }, 'A'],
      { step: 'A', alter: notes.accidentals.doubleSharp },
    ],
    [
      [{ step: 'B', alter: notes.accidentals.doubleFlat }, 'B'],
      { step: 'B', alter: notes.accidentals.doubleFlat },
    ],

    [
      [{ step: 'C', alter: notes.accidentals.sharp }, 'D'],
      { step: 'D', alter: notes.accidentals.flat },
    ],
    [
      [{ step: 'C', alter: notes.accidentals.sharp }, 'C'],
      { step: 'C', alter: notes.accidentals.sharp },
    ],
    [
      [{ step: 'D', alter: notes.accidentals.flat }, 'C'],
      { step: 'C', alter: notes.accidentals.sharp },
    ],
    [
      [{ step: 'D', alter: notes.accidentals.flat }, 'D'],
      { step: 'D', alter: notes.accidentals.flat },
    ],
    [
      [{ step: 'C', alter: notes.accidentals.doubleSharp }, 'D'],
      { step: 'D', alter: notes.accidentals.doubleFlat },
    ],
    [
      [{ step: 'C', alter: notes.accidentals.doubleSharp }, 'C'],
      { step: 'C', alter: notes.accidentals.doubleSharp },
    ],
    [
      [{ step: 'D', alter: notes.accidentals.doubleFlat }, 'C'],
      { step: 'C', alter: notes.accidentals.doubleSharp },
    ],
    [
      [{ step: 'D', alter: notes.accidentals.doubleFlat }, 'D'],
      { step: 'D', alter: notes.accidentals.doubleFlat },
    ],

    [[{ step: 'A' }, 'B'], { step: 'B', alter: notes.accidentals.doubleFlat }],
    [[{ step: 'A' }, 'G'], { step: 'G', alter: notes.accidentals.doubleSharp }],
    [[{ step: 'B' }, 'C'], { step: 'C', alter: notes.accidentals.flat }],
    [[{ step: 'B' }, 'A'], { step: 'A', alter: notes.accidentals.doubleSharp }],
    [[{ step: 'C' }, 'D'], { step: 'D', alter: notes.accidentals.doubleFlat }],
    [[{ step: 'C' }, 'B'], { step: 'B', alter: notes.accidentals.sharp }],
    [[{ step: 'D' }, 'E'], { step: 'E', alter: notes.accidentals.doubleFlat }],
    [[{ step: 'D' }, 'C'], { step: 'C', alter: notes.accidentals.doubleSharp }],
    [[{ step: 'E' }, 'F'], { step: 'F', alter: notes.accidentals.flat }],
    [[{ step: 'E' }, 'D'], { step: 'D', alter: notes.accidentals.doubleSharp }],
    [[{ step: 'F' }, 'G'], { step: 'G', alter: notes.accidentals.doubleFlat }],
    [[{ step: 'F' }, 'E'], { step: 'E', alter: notes.accidentals.sharp }],
    [[{ step: 'G' }, 'A'], { step: 'A', alter: notes.accidentals.doubleFlat }],
    [[{ step: 'G' }, 'F'], { step: 'F', alter: notes.accidentals.doubleSharp }],
    [[{ step: 'D' }, 'F'], { step: 'F', alter: -3 }],
    [[{ step: 'D' }, 'B'], { step: 'B', alter: 3 }],
    [[{ step: 'E' }, 'C'], { step: 'C', alter: 4 }],
    [[{ step: 'E' }, 'G'], { step: 'G', alter: -3 }],
  ]

  test.each(withTarget)('enharmonic(%s) -> %s', (note, expected) => {
    expect(notes.enharmonic(note[0], note[1])).toEqual(expected)
  })
})

describe('test noteDistance function', () => {
  const distanceTests: [[notes.PitchClass, notes.PitchClass], [number, number]][] = [
    [
      [{ step: 'A' }, { step: 'A', alter: notes.accidentals.sharp }],
      [1, -11],
    ],
    [
      [{ step: 'A' }, { step: 'B' }],
      [2, -10],
    ],
  ]
  test.each(distanceTests)('getNoteDistance(%s) -> %s', (args, expected) => {
    const { up, down } = notes.pitchClassDistance(...args)
    expect([up, down]).toEqual(expected)
  })
})
