<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, scale } from 'svelte/transition'
  import { cubicIn, cubicOut } from 'svelte/easing'
  import { Info, Check, Alert, XMark } from '$lib/Icons/index'

  export let type: 'info' | 'success' | 'error' | 'warning' = 'info'
  export let title: string

  const _styles = {
    info: {
      icon: Info,
      fgColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    success: {
      icon: Check,
      fgColor: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    warning: {
      icon: Alert,
      fgColor: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    error: {
      icon: Alert,
      fgColor: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  }

  let _show = true
  let _loaded = false
  onMount(() => {
    setTimeout(() => (_loaded = true), 50)
  })

  $: _style = _styles[type]
</script>

<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  {#if _loaded && _show}
    <div
      in:fade={{ duration: 300, easing: cubicOut }}
      out:fade={{ duration: 200, easing: cubicIn }}
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    />

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          in:scale={{ duration: 300, easing: cubicOut }}
          out:scale={{ duration: 200, easing: cubicIn }}
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="text-right ml-4 mk--mt-4 w-full max-h-4">
              <button class="" on:click={() => (_show = !_show)}>
                <XMark />
              </button>
            </div>
            <div class="sm:flex {$$slots.message ? 'sm:items-start' : 'sm:items-center'}">
              {#if $$slots.icon}
                <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full {_style.bgColor} sm:mx-0 sm:h-10 sm:w-10"
                >
                  <slot name="icon" />
                </div>
              {/if}
              <div class="mt-3 text-center sm:mt-0 {$$slots.icon ? 'sm:ml-4' : ''} sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                  {title}
                </h3>
                {#if $$slots.message}
                  <div class="mt-2 text-sm text-gray-500">
                    <slot name="message" />
                  </div>
                {/if}
              </div>
            </div>
          </div>
          {#if $$slots.buttons}
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <slot name="buttons" />
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
