<script lang="ts">
  import App from '$lib/App.svelte'
  import Controls from '$lib/Controls.svelte'
  import Modal from '$lib/UI/Modal.svelte'
  import Staff from '$lib/SheetMusic/Staff.svelte'
  import { channel, message, note, type midi } from 'midi'

  const inputRegistry = {
    get: async (id: string) => {
      const json = JSON.parse(localStorage.getItem('midi-input-' + id) ?? '{}')
      const input: Partial<midi.Input> = {
        channels: new Map<channel.ChannelNumber, channel.ChannelState>(),
      }

      if (json.id === id) {
        input.id = id
        const name = json.name
        if (typeof name === 'string') {
          input.name = name
        }

        const manufacturer = json.manufacturer
        if (typeof manufacturer === 'string') {
          input.manufacturer = manufacturer
        }

        const version = json.version
        if (typeof version === 'string') {
          input.version = version
        }

        const channels = json.channels
        if (channels) {
          let channelNumber = 0
          while (message.isChannelNumber(channelNumber)) {
            const ch = channels[channelNumber]
            if (ch && ch['number'] === channelNumber) {
              const noteEntries = Object.entries(
                ch['notes'] as { [key in note.NoteNumber]?: note.NoteState }
              ) as Array<[string, note.NoteState]>

              const chState: channel.ChannelState = {
                number: ch['number'],
                notes: new Map<note.NoteNumber, note.NoteState>(
                  noteEntries.map((entry) => {
                    return [parseInt(entry[0]) as note.NoteNumber, entry[1]]
                  })
                ),
                aftertouch: ch['aftertouch'],
                pitchBend: ch['pitchBend'],
                program: ch['program'],
                controls: ch['controls'],
                mode: ch['mode'],
              }
              input.channels?.set(channelNumber, chState)
            }
            channelNumber++
          }
        }
      }

      console.log('registered input', input)
      return input
    },
    set: async (input: midi.Input) => {
      localStorage.setItem('midi-input-' + input.id, JSON.stringify(input))
    },
  }
</script>

<App let:inputs {inputRegistry}>
  <Controls {inputs} {inputRegistry} />
</App>

{#if false}
  <Modal type="info" title="Do the thing">
    <svelte:fragment slot="buttons">
      <button
        type="button"
        class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
      >Deactivate</button
      >
      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
      >Cancel</button
      >
    </svelte:fragment>
  </Modal>
{/if}

<Staff clef="treble" />