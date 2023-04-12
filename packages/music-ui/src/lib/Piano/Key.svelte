<script lang="ts">
  import { note } from 'midi'
  import colors from 'tailwindcss/colors'
  export let tone: note.Tone
  export let semitone: note.Semitone
  export let octave = 0
  export let on: boolean
  export let blink = false

  const blinkColors =
    semitone.value === note.NATURAL.value
      ? [colors.amber[400], colors.amber[500], colors.gray[50], colors.white]
      : [colors.amber[500], colors.amber[600], colors.gray[800], colors.black]

  $: cssVars = blink
    ? `

      --backgroundFrom: linear-gradient(to bottom, ${blinkColors[0]}, ${blinkColors[1]});
      --backgroundTo: linear-gradient(to bottom, ${blinkColors[2]}, ${blinkColors[3]});`
    : ''

  $: bg =
    semitone.value === note.NATURAL.value
      ? on || blink
        ? `bg-gradient-to-b from-amber-400 to-amber-500 `
        : `bg-gradient-to-b from-gray-50 to-white `
      : on || blink
      ? 'bg-gradient-to-b from-amber-500 to-amber-600 '
      : `bg-gradient-to-b from-gray-800 to-black shadow-md `
  let size = semitone.value === note.NATURAL.value ? `h-full w-6 ` : `h-4/6 w-4 `
  let position = semitone.value === note.NATURAL.value ? `` : `relative right-2 -mr-4 `
</script>

<div
  class="{`border-r border-b border-gray-500 ${bg} ${size} ${position}`}}"
  style={cssVars}
  class:blink
/>

<style>
  .blink {
    animation-name: blink;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in;
  }

  @keyframes blink {
    from {
      background: var(--backgroundFrom);
    }

    to {
      background: var(--backgroundTo);
    }
  }
</style>
