import type { StorybookConfig } from '@storybook/sveltekit'
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}
export default config
