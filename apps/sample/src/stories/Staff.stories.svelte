<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import * as ui from 'music-ui'
</script>

<Meta title="Octaves/Score/Staff" component={ui.SheetMusic.Staff} />

<Template let:args>
  <ui.SheetMusic.Staff {...args} />
</Template>

<Story name="G Clef" args={{ clef: 'treble' }} />
<Story name="F Clef" args={{ clef: 'bass' }} />
