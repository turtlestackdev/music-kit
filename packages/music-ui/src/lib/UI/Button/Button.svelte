<script lang="ts">
  import { type StyleSet, styles } from '../styles'

  export let label = 'Button'
  export let type: 'info' | 'success' | 'error' | 'warning' | undefined = undefined
  export let style: StyleSet = type
    ? styles[type]
    : {
        bg: 'bg-white',
        text: 'text-gray-900',
        hover: 'bg-gray-50',
        accent: 'bg-gray-300',
      }

  export let onClick: ((event: Event) => void) | undefined = undefined
</script>

<button
  type="button"
  class="inline-flex w-full justify-center rounded-md {style.bg} px-3 py-2 text-sm font-semibold {style.text} shadow-sm hover:{style.hover} sm:ml-3 sm:w-auto"
  >{label}</button
>
