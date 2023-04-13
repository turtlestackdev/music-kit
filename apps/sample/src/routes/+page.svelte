<script lang="ts">
  //import { App } from 'music-ui';
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

  console.log(inputRegistry)
</script>
<h1  class="text-3xl font-bold underline">Welcome to SvelteKit</h1>

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>