<script lang="ts">
  import Keyboard from '$lib/Piano/Keyboard.svelte'
  import { midi, message, note, channel } from 'midi'
  import { onDestroy } from 'svelte'
  import Modal from '$lib/UI/Modal.svelte'
  import type { InputRegistry, KeyState } from './types'
  import { Check } from '$lib/Icons'
  import { fade, scale } from 'svelte/transition'
  import { cubicIn, cubicOut } from 'svelte/easing'

  export let inputs: Map<string, midi.Input>
  export let inputRegistry: InputRegistry | undefined = undefined

  onDestroy(() => {
    if (activeInput) {
      activeInput.removeStateChangeListener(handleMIDIState)
      activeInput.removeMessageListener(registerNotes)
    }
  })

  let inputId = ''
  export let activeInput: midi.Input | undefined = undefined
  let activeChannel: channel.ChannelNumber = 0
  let keys: Map<message.DataByte, note.NoteState> = new Map()
  let registerInput = false
  let registrationComplete = false
  let registeredNotes: [] | [message.DataByte] | [message.DataByte, message.DataByte] = []

  function registerNotes(msg: message.MIDIMessage) {
    if (msg.messageCategory === 'Channel' && msg.messageType === 'Voice') {
      switch (msg.messageAction) {
        case 'Note On':
          if (registeredNotes.length === 0) {
            activeChannel = msg.channel
            registeredNotes = [msg.noteNumber]
            firstModalKey.on = true
            firstModalKey.blink = false
            lastModalKey.blink = true
          } else {
            // ignore if it's the same key or a different channel
            if (msg.noteNumber !== registeredNotes[0] && msg.channel === activeChannel) {
              // instead of throwing an error for a lower second note number, just sort the values.
              registeredNotes = [
                Math.min(registeredNotes[0], msg.noteNumber) as message.DataByte,
                Math.max(registeredNotes[0], msg.noteNumber) as message.DataByte,
              ]
            }
            lastModalKey.on = true
            lastModalKey.blink = false
          }
          // needed to refresh view
          modalKeyMap = modalKeyMap
          break
        case 'Note Off':
          if (registeredNotes.length == 2) {
            //registerInput = false
            registrationComplete = true
            keys = activeInput?.channels.get(activeChannel)?.notes ?? new Map()
            activeInput?.removeMessageListener(registerNotes)
            if (activeInput && inputRegistry) {
              inputRegistry.set(activeInput)
            }
          }
          break
      }
    }
  }

  function handleMIDIState(state: midi.Input) {
    activeInput = state
  }

  function setInput(input: midi.Input | undefined) {
    if (activeInput) {
      activeInput.removeStateChangeListener(handleMIDIState)
    }
    activeInput = input
    if (activeInput) {
      activeInput.addStateChangeListener(handleMIDIState)
      keys = activeInput.channels.get(activeChannel)?.notes ?? new Map()
      if (keys.size === 0) {
        firstModalKey.blink = true
        registerInput = true
        registrationComplete = false
        registeredNotes = []
        activeInput.addMessageListener(registerNotes)
      }
    }
  }

  let modalKeyMap: Map<note.NoteNumber, KeyState> = note.getNotes(30)
  const firstModalKey = modalKeyMap.get(21) as KeyState
  const lastModalKey = modalKeyMap.get(50) as KeyState

  $: keys = activeInput?.channels.get(activeChannel)?.notes ?? new Map()
  $: modalKeys = modalKeyMap
</script>

<div>
  {#if inputs !== undefined}
    <select
      bind:value={inputId}
      on:change={() => {
        setInput(midi.inputs.get(inputId))
      }}
    >
      <option value="">Select MIDI Input</option>
      {#each [...inputs] as [id, input] (id)}
        <option value={id}>{input.name}</option>
      {/each}
    </select>
    <!-- svelte-ignore missing-declaration -->
    {#if registerInput}
      <slot name="registerModal">
        <Modal type="info" title="Register Keyboard">
          <svelte:fragment slot="message">
            {#if !registrationComplete}
              <div out:fade>
                <p>
                  Please press and release the first and last keys on your keyboard. This helps us
                  determine the number of keys.
                </p>
                <Keyboard keys={modalKeys} className="mt-4 w-full" />
                <div class="flex bottom-8  relative items-center h-0">
                  {#if registeredNotes.length > 0}
                    <div class="grow relative left-3">
                      <div
                        in:scale={{ duration: 300, easing: cubicOut }}
                        out:scale={{ duration: 200, easing: cubicIn }}
                        class="mx-auto flex flex-shrink-0 items-center justify-center rounded-full bg-white sm:mx-0 sm:h-8 sm:w-8 shadow-lg border border-green-500"
                      >
                        <Check />
                      </div>
                    </div>
                  {/if}
                  {#if registeredNotes.length > 1}
                    <div class="relative right-3">
                      <div
                        in:scale={{ duration: 300, easing: cubicOut }}
                        out:scale={{ duration: 200, easing: cubicIn }}
                        class="mx-auto flex flex-shrink-0 items-center justify-center rounded-full bg-white sm:mx-0 sm:h-8 sm:w-8 shadow-lg border border-green-500"
                      >
                        <Check />
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            {:else}
              <div in:fade>
                <p>
                  Your keyboard has {keys.size} keys.
                </p>
                <div class="mx-auto flex flex-grow items-center justify-center ">
                  <Check className="w-216 h-216 text-green-600" />
                </div>
              </div>
            {/if}
          </svelte:fragment>
        </Modal>
      </slot>
    {:else}
      <Keyboard {keys} />
    {/if}
  {/if}
</div>
