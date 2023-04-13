<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import * as ui from 'music-ui'
  import { note, midi } from 'midi'

  const fullKeys = new Map(note.getNotes(88))

  midi.requestAccess()
</script>

<Meta title="Octaves/Keys/Keyboard" component={ui.Piano.KeyBoard} />

<Template let:args>
  <ui.Piano.KeyBoard {...args} />
</Template>

<Story name="Full" args={{ keys: fullKeys }} />
