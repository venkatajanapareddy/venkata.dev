---
title: 'Frontend Performance Optimization in 2023'
date: '2023-07-20'
---

Frontend performance affects user experience directly. Slow loading times increase bounce rates. Laggy interactions frustrate users. Even small delays impact conversion rates.

The web platform evolves and so do optimization techniques. What worked in 2020 might not be the best approach in 2023.

## Core Web Vitals

Google's Core Web Vitals measure user experience:

**Largest Contentful Paint (LCP)**: How quickly the main content loads. Target under 2.5 seconds.

**First Input Delay (FID)**: Measures responsiveness to user input. Target under 100ms.

**Cumulative Layout Shift (CLS)**: Visual stability. Elements shouldnt jump around during load. Target under 0.1.

These metrics correlate with real user experience and affect search rankings.

## Image optimization

Images are often the largest assets. Optimize them:

Use modern formats like WebP or AVIF:

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

Browsers automatically choose the best supported format.

Size images appropriately:

```html
<img
  src="hero-1200.jpg"
  srcset="
    hero-600.jpg 600w,
    hero-1200.jpg 1200w,
    hero-2400.jpg 2400w
  "
  sizes="(max-width: 600px) 600px, (max-width: 1200px) 1200px, 2400px"
  alt="Hero image"
>
```

Browsers load the right size for the viewport. Don't send 4K images to mobile devices.

## Code splitting

Don't ship all JavaScript upfront. Split by route:

```javascript
// React with lazy loading
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

Users only download code for routes they visit.

Split large libraries:

```javascript
// Bad - imports entire library
import { debounce } from 'lodash';

// Better - imports only what you need
import debounce from 'lodash/debounce';
```

Or use libraries designed for tree-shaking like lodash-es.

## Preloading and prefetching

Tell browsers what to load early:

```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/critical.css" as="style">

<!-- Prefetch for likely navigation -->
<link rel="prefetch" href="/dashboard.js">
```

Preload loads resources immediately. Prefetch loads when browser is idle.

For Next.js Link components automatically prefetch:

```jsx
<Link href="/dashboard" prefetch={true}>
  Dashboard
</Link>
```

## Font loading

Web fonts can cause layout shift or invisible text. Use font-display:

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
}
```

`font-display: swap` shows fallback font immediately then swaps when custom font loads.

Preload critical fonts:

```html
<link
  rel="preload"
  href="/fonts/main.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

## JavaScript execution

Large JavaScript bundles block the main thread. Optimize:

Defer non-critical scripts:

```html
<script src="analytics.js" defer></script>
```

Or use async for scripts that dont depend on DOM:

```html
<script src="tracking.js" async></script>
```

Break up long tasks:

```javascript
// Bad - blocks main thread
function processLargeArray(items) {
  items.forEach(item => {
    expensiveOperation(item);
  });
}

// Better - yields to browser
async function processLargeArray(items) {
  for (const item of items) {
    expensiveOperation(item);

    // Yield every 50 items
    if (items.indexOf(item) % 50 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
```

This lets the browser handle user input between chunks.

## Third-party scripts

Third-party scripts often hurt performance. Audit what you load:

```javascript
// Measure third-party impact
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.initiatorType === 'script') {
      console.log(entry.name, entry.duration);
    }
  }
});

observer.observe({ entryTypes: ['resource'] });
```

Load third-party scripts after main content:

```javascript
window.addEventListener('load', () => {
  // Load analytics after page loads
  const script = document.createElement('script');
  script.src = 'https://analytics.example.com/script.js';
  document.body.appendChild(script);
});
```

## Caching strategies

Cache assets aggressively:

```
# .htaccess or server config
<FilesMatch "\.(jpg|jpeg|png|gif|svg|woff2)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

<FilesMatch "\.(js|css)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
```

Use content hashes in filenames so cache breaks when files change:

```
app-a3f2b1c.js
styles-d4e5f6g.css
```

Service workers cache dynamically:

```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/app.js',
        '/styles.css',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## CSS optimization

Remove unused CSS with PurgeCSS or similar:

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.html', './src/**/*.jsx'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
}
```

This removes CSS not referenced in your templates.

Use CSS containment for complex layouts:

```css
.widget {
  contain: layout style paint;
}
```

This tells browsers the widget wont affect outside layout improving rendering performance.

## Monitoring performance

Use Real User Monitoring (RUM) to track actual user experience:

```javascript
// web-vitals library
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify({ metric: name, value, id }),
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

This shows how real users experience your site not just synthetic tests.

## Database and API optimization

Frontend performance depends on backend speed. Optimize API calls:

```javascript
// Bad - sequential requests
const user = await fetch('/api/user');
const posts = await fetch('/api/posts');
const comments = await fetch('/api/comments');

// Better - parallel requests
const [user, posts, comments] = await Promise.all([
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/comments'),
]);
```

Cache API responses:

```javascript
const cache = new Map();

async function fetchWithCache(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  return data;
}
```

## Build optimization

Modern build tools handle many optimizations automatically. Verify your setup:

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        },
      },
    },
  },
};
```

This splits vendor code from application code for better caching.

## Progressive enhancement

Build pages that work without JavaScript then enhance:

```html
<!-- Works without JS -->
<form action="/search" method="GET">
  <input name="q" type="search">
  <button>Search</button>
</form>

<script>
  // Enhance with JS
  document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const results = await searchAPI(e.target.q.value);
    displayResults(results);
  });
</script>
```

Core functionality works immediately while JavaScript loads. Users dont have to wait for the full app bundle.

## Common mistakes

Premature optimization. Measure first then optimize bottlenecks.

Over-optimizing everything. Some pages dont need aggressive optimization if they're rarely visited.

Ignoring mobile. Test performance on actual mobile devices not just desktop Chrome. Mobile networks and CPUs are much slower.

Not measuring real users. Lab metrics dont always match field performance.

## Summary

Frontend performance optimization in 2023 focuses on Core Web Vitals, code splitting, and modern image formats. Measure real user experience with RUM data.

Start with the biggest wins: optimize images, split code by route, and lazy load non-critical resources. Use modern build tools that handle many optimizations automatically. The web platform provides more performance APIs and better defaults than ever before.
