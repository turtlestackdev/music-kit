<script lang="ts">
  import { midi } from 'midi'
  import { onMount } from 'svelte'
  import type { InputRegistry } from './types'

  export let inputs: Map<string, midi.Input> = new Map()
  export let inputRegistry: InputRegistry | undefined = undefined

  onMount(async () => {
    await midi.requestAccess()
    if (inputRegistry !== undefined) {
      for (let [id, input] of midi.inputs) {
        midi.inputs.set(id, { ...input, ...(await inputRegistry.get(id)) })
      }
    }
    inputs = midi.inputs
  })
</script>

<slot {inputs} />
