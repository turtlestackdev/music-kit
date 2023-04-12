export class MIDISupportError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MIDISupportError'
  }
}

export class MIDIAccessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MIDIAccessError'
  }
}

export class MIDIPitchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MIDIPitchError'
  }
}

export class UnimplementedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnimplementedError'
  }
}
