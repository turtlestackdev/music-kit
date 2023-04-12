<script lang="ts">
  import type { note, message } from 'midi'
  import Key from './Key.svelte'

  export let keys: Map<message.DataByte, note.NoteState & { blink?: boolean }> = new Map()
  export let className = ''
</script>

<div class={`${className} flex justify-center bg-black w-full min-h-[16rem] relative p-1 pb-2`}>
  <div class={`flex`}>
    {#each [...keys].sort((a, b) => a[0] - b[0]) as [number, key] (number)}
      <Key {...key} />
    {/each}
  </div>
</div>
