---
title: 'State Management Patterns in React 2022'
date: '2022-03-15'
---

React applications need to manage state. Simple apps might only need component state with useState. Larger applications get messy when state needs to be shared across many components.

There are several approaches to state management in React. Each has tradeoffs depending on your application size and complexity.

## Component state with useState

For simple cases component state works fine. If state is only used in one component or passed to a few child components you probably dont need anything else.

```jsx
// Counter.jsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

This is straightforward. The state lives in the component and you update it with setter functions.

Problems start when you need to share state between components that dont have a parent-child relationship. Passing props through multiple levels gets tedious.

## Context API for shared state

React Context lets you share state without prop drilling. You create a context, provide it at a high level, and consume it in any child component.

```jsx
// ThemeContext.jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

Now any component can access the theme:

```jsx
// Header.jsx
import { useTheme } from './ThemeContext';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  );
}
```

Context works well for theme, auth state, or user preferences. Its built into React so no extra dependencies.

The downside is performance. When context value changes all consumers re-render even if they only use part of the value.

## Redux for complex state

Redux is still popular for large applications. It provides a single store with predictable state updates through actions and reducers.

```javascript
// store.js
import { createStore } from 'redux';

const initialState = {
  count: 0
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

export const store = createStore(reducer);
```

Redux has more boilerplate but enforces patterns that help with debugging and testing. The Redux DevTools let you see every state change and time travel through actions.

For small apps Redux feels like overkill. For apps with lots of shared state and complex updates it can help keep things organized.

## Zustand for simplicity

Zustand is a newer state management library thats much simpler than Redux. It uses hooks and doesnt require providers.

```javascript
// store.js
import create from 'zustand';

export const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}));
```

Using it in a component:

```jsx
// Counter.jsx
import { useStore } from './store';

export function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

Zustand is lightweight and doesnt have the boilerplate of Redux. Components only re-render when the specific state they use changes.

## Jotai for atomic state

Jotai takes a different approach with atoms. Each piece of state is an atom that can be read and written independently.

```javascript
// atoms.js
import { atom } from 'jotai';

export const countAtom = atom(0);
```

```jsx
// Counter.jsx
import { useAtom } from 'jotai';
import { countAtom } from './atoms';

export function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

Jotai has minimal boilerplate and works well when you have many independent pieces of state. Its similar to Recoil but simpler.

## Which one to use

**For small apps:** useState and maybe Context for a few global values like theme or auth.

**For medium apps:** Context or Zustand. Context if you want to stick with React built-ins, Zustand if you want better performance and simpler API.

**For large apps:** Redux or Zustand. Redux if you need the ecosystem and DevTools, Zustand if you prefer simplicity.

**For specific patterns:** Jotai if you like the atomic approach and have lots of independent state.

Theres no single right answer. It depends on your team, application size, and personal preference.

## Things to consider

Dont add state management libraries too early. Start with useState and Context. Add more complex solutions when you actually need them.

Performance matters but usually not as much as you think. Profile your app before optimizing state management.

Team experience is important. If everyone knows Redux it might be better to stick with that than introduce something new.

## Summary

React has many state management options in 2022. Component state and Context cover most use cases. Libraries like Redux, Zustand, and Jotai help with larger applications.

Start simple and add complexity when you need it. This guide covers basic patterns but each library has more features documented on their websites.
