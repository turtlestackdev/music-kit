// lint-staged.config.mjs
export default {
  // Type check TypeScript files
  '**/*.(ts|tsx|svelte)': () => 'pnpm tsc --noEmit',

  // Lint then format TypeScript and JavaScript files
  '**/*.(ts|tsx|js|svelte)': (filenames) => [
    `svelte-check`,
    `pnpm eslint --fix ${filenames.join(' ')}`,
    `pnpm prettier --write ${filenames.join(' ')}`,
  ],

  // Format MarkDown and JSON
  '**/*.(md|json)': (filenames) => `pnpm prettier --write ${filenames.join(' ')}`,
}
