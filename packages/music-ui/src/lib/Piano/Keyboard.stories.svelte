<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Keyboard from '$lib/Piano/Keyboard.svelte'
  import { note, midi } from 'midi'

  const fullKeys = new Map(note.getNotes(88))

  midi.requestAccess()
</script>

<Meta title="Octaves/Keys/Keyboard" component={Keyboard} />

<Template let:args>
  <Keyboard {...args} />
</Template>

<Story name="Full" args={{ keys: fullKeys }} />
