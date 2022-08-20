---
title: 'Migrating from Create React App to Vite'
date: '2022-08-20'
---

Create React App has been the default way to start React projects for years. But it can be slow. Running `npm start` takes time to compile. Making changes requires waiting for rebuilds.

Vite is much faster. It uses native ES modules during development and esbuild for bundling. The difference in speed is noticeable especially on larger projects.

## Why migrate

The main reason is development server speed. Vite starts almost instantly. Changes appear in the browser within milliseconds. Create React App can take 30 seconds or more to start and several seconds for hot reload. It's a noticeable difference when you're making frequent changes.

Build times are also faster with Vite. Production builds that took 2-3 minutes with CRA might take 30-40 seconds with Vite.

If your current setup is working fine you might not need to migrate. But if youre frustrated with slow builds Vite is worth trying.

## Creating a new Vite project

First lets see what a new Vite project looks like:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

The project structure is similar to CRA but with some differences. Vite uses `index.html` at the root instead of in a `public` folder.

## Migration steps

Start by creating a new Vite project with the same name in a different folder. You'll copy files from your CRA project into this structure.

### Update index.html

CRA keeps index.html in `public/`. Vite keeps it in the root. Move your index.html to the root and update it:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

The key change is the script tag. It needs `type="module"` and points to your entry file.

### Rename src/index.js to src/main.jsx

Vite expects the entry file to be `main.jsx` (or `main.tsx` for TypeScript). Rename your index file and update the imports:

```javascript
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

This is similar to CRA but uses the new `createRoot` API.

### Update environment variables

CRA uses `REACT_APP_` prefix for environment variables. Vite uses `VITE_` prefix.

```bash
# .env in CRA
REACT_APP_API_URL=https://api.example.com

# .env in Vite
VITE_API_URL=https://api.example.com
```

Update your code to use the new prefix:

```javascript
// CRA
const apiUrl = process.env.REACT_APP_API_URL;

// Vite
const apiUrl = import.meta.env.VITE_API_URL;
```

### Handle public assets

CRA serves files from `public/` automatically. Vite does the same but the URL handling is different.

In CRA you reference public files with `%PUBLIC_URL%`:

```html
<img src="%PUBLIC_URL%/logo.png" />
```

In Vite just use the path:

```html
<img src="/logo.png" />
```

### Update imports

If you use absolute imports with CRA you need to configure them in Vite. Create or update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Then update imports in your code:

```javascript
// Before
import Button from 'components/Button';

// After
import Button from '@/components/Button';
```

### Install dependencies

You need the Vite React plugin:

```bash
npm install --save-dev vite @vitejs/plugin-react
```

Remove CRA dependencies:

```bash
npm uninstall react-scripts
```

### Update package.json scripts

Replace CRA scripts with Vite commands:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Common issues

### SVG imports

CRA lets you import SVGs as React components with a special syntax. Vite needs a plugin for this:

```bash
npm install --save-dev vite-plugin-svgr
```

```javascript
// vite.config.js
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
})
```

### Jest configuration

CRA includes Jest configuration. With Vite you need to set it up yourself. Consider using Vitest instead since it's designed to work with Vite:

```bash
npm install --save-dev vitest
```

### CSS Modules

Vite supports CSS Modules out of the box. Files ending in `.module.css` are treated as CSS Modules just like in CRA.

### Global variables

If you use `process.env.NODE_ENV` you need to change it to `import.meta.env.MODE` in Vite.

## Testing the migration

Run the dev server:

```bash
npm run dev
```

Check that all pages load correctly. Test environment variables, imports, and public assets. Make sure your build still works:

```bash
npm run build
npm run preview
```

The preview command serves the production build locally so you can test it before deploying.

## Is it worth it

For small projects the migration might take an hour or two. For large projects with lots of custom configuration it could take longer.

The speed improvement is significant. If slow builds are slowing down your development the migration pays off quickly. You dont want to waste time waiting for hot reload.

If you have a working CRA setup with custom webpack config the migration might be more complex. You'll need to find Vite equivalents for webpack plugins.

## Summary

Migrating from CRA to Vite makes development faster. The migration process is straightforward for most projects. Main changes are moving index.html, renaming entry file, and updating environment variable prefixes.

Start with a small project to get familiar with Vite before migrating larger applications. The Vite documentation covers more advanced configuration options.
