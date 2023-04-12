<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Staff from '$lib/Staff.svelte'
</script>

<Meta title="Octaves/Score/Staff" component={Staff} />

<Template let:args>
  <Staff {...args} />
</Template>

<Story name="G Clef" args={{ clef: 'treble' }} />
<Story name="F Clef" args={{ clef: 'bass' }} />
