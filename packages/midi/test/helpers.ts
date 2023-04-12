import type { MIDIMessage } from '../src/message.types'
import { message } from '../src'

// Dumb typeguard not suitable for general usage.
function isMIDIConnectionEvent(
  event: MIDIMessageEvent | MIDIConnectionEvent
): event is MIDIConnectionEvent {
  return 'port' in event
}

export interface MidiPortProps {
  id: string
  manufacturer: string
  name: string
}

class BaseMidiPort implements MIDIPort {
  type: 'input' | 'output'
  id: string
  manufacturer: string
  name: string
  version: string
  state: MIDIPortDeviceState
  connection: MIDIPortConnectionState

  constructor(type: 'input' | 'output', props: MidiPortProps) {
    this.type = type
    this.id = props.id
    this.manufacturer = props.manufacturer
    this.name = props.name
    this.version = '1'
    this.state = 'connected'
    this.connection = 'open'
  }

  addEventListener(
    type: 'statechange' | string,
    listener:
      | ((this: this, e: MIDIConnectionEvent) => unknown)
      | EventListenerOrEventListenerObject
      | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    console.log(`type: ${type}`)
    console.log(`listener: ${listener}`)
    console.log(`options: ${options}`)
  }

  open(): Promise<MIDIPort> {
    this.connection = 'open'
    return Promise.resolve(this)
  }

  close(): Promise<MIDIPort> {
    this.connection = 'closed'
    return Promise.resolve(this)
  }

  dispatchEvent(event: Event): boolean {
    console.log(`event: ${event}`)
    return true
  }

  onstatechange(e: Event): void {
    // onstatechange will be replaced in dispatcher.setMIDIAccess
    console.log(`midi state change event: ${e}`)
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void {
    console.log(`type: ${type}`)
    console.log(`callback: ${callback}`)
    console.log(`options: ${options}`)
  }
}

class BaseMIDIInput extends BaseMidiPort implements MIDIInput {
  readonly type = 'input' as const

  constructor(props: MidiPortProps) {
    super('input', props)
  }

  onmidimessage(e: Event): void {
    // onmidimessage will be replaced in dispatcher.setMIDIAccess
    console.log(`midi message event: ${e}`)
  }

  addEventListener(
    type: 'midimessage',
    listener: (this: MIDIInput, e: MIDIMessageEvent) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void
  addEventListener(
    type: 'statechange',
    listener: (this: MIDIInput, e: MIDIConnectionEvent) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void
  addEventListener(
    type: 'midimessage' | string | 'statechange',
    listener:
      | ((this: MIDIInput, e: MIDIMessageEvent) => unknown)
      | EventListenerOrEventListenerObject
      | ((this: MIDIInput, e: MIDIConnectionEvent) => unknown),
    options?: boolean | AddEventListenerOptions
  ): void {
    console.log(`type: ${type}`)
    console.log(`listener: ${listener}`)
    console.log(`options: ${options}`)
  }

  dispatchEvent(event: MIDIMessageEvent | MIDIConnectionEvent): boolean {
    if (isMIDIConnectionEvent(event)) {
      this.onstatechange(event)
    } else {
      this.onmidimessage(event)
    }

    return true
  }
}

class BaseMIDIOutput extends BaseMidiPort implements MIDIOutput {
  readonly type = 'output' as const

  constructor(props: MidiPortProps) {
    super('output', props)
  }

  clear(): void {
    console.log('clear called')
  }

  send(data: number[] | Uint8Array, timestamp?: number): void {
    console.log(`data: ${data}`)
    console.log(`timestamp: ${timestamp}`)
  }
}

export function getMIDIAccess(
  inputProps: MidiPortProps[] = [],
  outputProps: MidiPortProps[] = []
): MIDIAccess {
  const inputs = new Map<string, MIDIInput>()
  inputProps.forEach((input) => inputs.set(input.id, new BaseMIDIInput(input)))

  const outputs = new Map<string, MIDIOutput>()
  outputProps.forEach((output) => outputs.set(output.id, new BaseMIDIOutput(output)))

  return {
    inputs: inputs,
    outputs: outputs,
    sysexEnabled: false,
    addEventListener(
      type: 'statechange' | string,
      listener:
        | ((this: MIDIAccess, e: MIDIConnectionEvent) => unknown)
        | EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void {
      console.log(`type: ${type}`)
      console.log(`listener: ${listener}`)
      console.log(`options: ${options}`)
    },
    onstatechange(e: Event): void {
      console.log(e)
    },
    dispatchEvent(event: Event): boolean {
      // dispatchEvent id overwritten in BaseMIDIInput
      // So, it's safe to assume a state change event
      if (this.onstatechange) {
        this.onstatechange(event as Event)
      }
      return true
    },
    removeEventListener(
      type: string,
      callback: EventListenerOrEventListenerObject | null,
      options?: EventListenerOptions | boolean
    ): void {
      console.log(`type: ${type}`)
      console.log(`listener: ${callback}`)
      console.log(`options: ${options}`)
    },
  }
}

export function getMIDIMessageEvent(msg: MIDIMessage): MIDIMessageEvent {
  const data = message.getMessageData(msg)
  return {
    data: data,
    // required but not needed
    AT_TARGET: 2,
    BUBBLING_PHASE: 3,
    CAPTURING_PHASE: 1,
    NONE: 0,
    bubbles: false,
    cancelBubble: false,
    cancelable: false,
    composed: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    returnValue: false,
    srcElement: null,
    timeStamp: 0,
    type: '',
    composedPath(): EventTarget[] {
      return []
    },
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
      console.log(type, bubbles, cancelable)
    },
    preventDefault(): void {
      console.log('noop')
    },
    stopImmediatePropagation(): void {
      console.log('noop')
    },
    stopPropagation(): void {
      console.log('noop')
    },
    currentTarget: null,
    target: null,
  }
}

export function configureMIDIRejected() {
  window.navigator.requestMIDIAccess = () => {
    return new Promise<MIDIAccess>((resolve, reject) => {
      reject('denied')
    })
  }
}

export function configureMIDIAccess(
  inputProps: MidiPortProps[] = [],
  outputProps: MidiPortProps[] = []
) {
  window.navigator.requestMIDIAccess = () => {
    return new Promise<MIDIAccess>((resolve) => {
      resolve(getMIDIAccess(inputProps, outputProps))
    })
  }
}
