---
title: 'Implementing Dark Mode in React Applications'
date: '2022-04-20'
---

Users expect dark mode in applications. It reduces eye strain in low light and saves battery on OLED screens. Some users prefer dark interfaces all the time.

Adding dark mode to React applications involves managing theme state, applying styles conditionally, and persisting user preferences.

## Basic approach with CSS variables

CSS variables make theme switching straightforward. Define colors for both themes:

```css
/* styles/themes.css */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
}

[data-theme="dark"] {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --border: #374151;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

Components reference these variables:

```css
.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
}
```

Toggle the theme by changing a data attribute on the root element.

## Theme context

Create a context to manage theme state:

```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

Wrap your app with the provider:

```jsx
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Theme toggle button

Create a button to switch themes:

```jsx
import { useTheme } from './ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

Users can click this to switch between light and dark mode.

## Respecting system preferences

Check the users system preference on first load:

```jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // Fall back to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ... rest of provider
}
```

This defaults to the users system setting if they havent chosen a preference in your app.

## Listening for system changes

Users might change their system theme while using your app:

```jsx
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e) => {
    // Only update if user hasnt set a preference
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

This keeps the app in sync with system changes unless the user explicitly chose a theme.

## Avoiding flash of wrong theme

Without proper handling users see a flash of light theme before dark mode loads. This happens because JavaScript runs after the page renders.

Add a script in your HTML head before React loads:

```html
<!DOCTYPE html>
<html>
<head>
  <script>
    (function() {
      const theme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <!-- rest of head -->
</head>
```

This sets the theme before any content renders.

## Styled components approach

If you use styled-components the pattern is similar:

```jsx
import { ThemeProvider } from 'styled-components';

const lightTheme = {
  bg: '#ffffff',
  text: '#000000',
};

const darkTheme = {
  bg: '#1f2937',
  text: '#f9fafb',
};

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyles />
      <YourApp />
    </ThemeProvider>
  );
}
```

Components access theme values through props:

```jsx
const Card = styled.div`
  background: ${props => props.theme.bg};
  color: ${props => props.theme.text};
`;
```

## Images and media

Some images dont work well in dark mode. Provide alternatives:

```jsx
function Logo() {
  const { theme } = useTheme();

  return (
    <img
      src={theme === 'light' ? '/logo-dark.svg' : '/logo-light.svg'}
      alt="Logo"
    />
  );
}
```

Or use CSS filters:

```css
[data-theme="dark"] img {
  filter: brightness(0.8) contrast(1.2);
}
```

This works for photos but might not be appropriate for logos or illustrations.

## Tailwind CSS approach

With Tailwind use the dark variant:

```jsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

Configure Tailwind to use a class strategy:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

Then add/remove the `dark` class on the root element instead of using a data attribute.

## Testing both themes

Test your application in both themes during development. Some issues only appear in one theme:

- Low contrast text
- Invisible borders
- Images that dont work in dark mode
- Hardcoded colors that override theme

Go through major user flows in both themes to catch these issues.

## Performance considerations

Theme switching should be instant. Don't make API calls or do expensive calculations when toggling themes.

Keep theme state separate from other application state. Users might switch themes frequently and it shouldnt affect other parts of the app.

## Common mistakes

Forgetting to theme all components. Some elements might use hardcoded colors instead of theme variables.

Not testing in both themes. Issues in dark mode often go unnoticed if you only test in light mode.

Making dark mode just an inverted light mode. Dark themes need adjusted colors not just black backgrounds.

Ignoring user preferences. Always respect system preferences as the default.

## Summary

Dark mode improves user experience and is expected in modern applications. Use CSS variables for theme colors, Context API for state management, and localStorage for persistence.

Respect system preferences but let users override them. Avoid flash of wrong theme with inline scripts. Test thoroughly in both themes to catch contrast and visibility issues.
