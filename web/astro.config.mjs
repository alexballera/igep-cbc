import { defineConfig } from 'astro/config';

// Reemplaza con tu usuario y nombre de repo
const GITHUB_USER = 'alexballera'; 
const REPO_NAME = 'igep-cbc';

export default defineConfig({
  site: 'https://alexballera.com',
  base: `/${REPO_NAME}/`,
});
