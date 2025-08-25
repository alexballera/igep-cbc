import { defineConfig } from 'astro/config';

// Reemplaza con tu usuario y nombre de repo
const GITHUB_USER = 'alexballera'; 
const REPO_NAME = 'igep';

export default defineConfig({
  site: `https://${GITHUB_USER}.github.io`,
  base: `/${REPO_NAME}/`,
});
