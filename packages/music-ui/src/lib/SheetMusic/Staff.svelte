<script lang="ts">
  import type { note } from 'midi'
  import BassClef from '$lib/Icons/BassClef.svelte'
  import TrebleClef from '$lib/Icons/TrebleClef.svelte'
  import type { KeySignature } from '$lib/types'
  export let clef: 'treble' | 'bass' | undefined = undefined
  const clefIcons = {
    treble: { icon: TrebleClef, size: 'h-32', position: 'mk--top-6 left-2' },
    bass: { icon: BassClef, size: 'h-20', position: 'top-0 left-2' },
  }
  export let keySignature: KeySignature | undefined = undefined
  let accidentals: Set<note.Tone> = new Set()
</script>

<div class="relative">
  <div class="mt-4 h-0.5 w-full bg-black" />
  <div class="mt-4 h-0.5 w-full bg-black" />
  <div class="mt-4 h-0.5 w-full bg-black" />
  <div class="mt-4 h-0.5 w-full bg-black" />
  <div class="mt-4 h-0.5 w-full bg-black" />
  {#if clef}
    <div class="absolute {clefIcons[clef].position}">
      <svelte:component this={clefIcons[clef].icon} className={clefIcons[clef].size} />
    </div>
  {/if}
</div>
