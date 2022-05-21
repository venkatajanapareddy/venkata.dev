---
title: 'Canceling HTTP Requests in JavaScript'
date: '2022-05-20'
---

Sometimes you need to cancel fetch requests. A user navigates away from a page before data loads. A search input changes before the previous search completes. An autocomplete fires too many requests.

Without cancellation these requests complete in the background wasting bandwidth and potentially updating state after a component unmounts.

AbortController provides a standard way to cancel fetch requests. Its built into modern browsers so no extra libraries needed.

## Basic usage

Create an AbortController and pass its signal to fetch:

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch('/api/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Fetch error:', error);
    }
  });

// Cancel the request
controller.abort();
```

When you call `abort()` the fetch promise rejects with an AbortError. You can check the error name to handle cancellation differently than network errors.

## Canceling on component unmount

In React you often fetch data in useEffect. If the component unmounts before the fetch completes you get warnings about setting state on unmounted components.

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch user:', error);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

The cleanup function cancels the request when the component unmounts or when userId changes. This prevents state updates on unmounted components.

## Search and autocomplete

For search inputs you want to cancel previous requests when the user types:

```jsx
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then(response => response.json())
      .then(data => setResults(data))
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
        }
      });

    return () => controller.abort();
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

When the query changes the previous fetch is canceled. Only the most recent search completes.

## Timeout for requests

You can abort requests that take too long:

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

// Usage
fetchWithTimeout('/api/slow-endpoint', 3000)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error.message));
```

This creates a timeout that cancels the request if it doesnt complete in time.

## Multiple requests with one controller

A single AbortController can cancel multiple requests:

```javascript
const controller = new AbortController();

Promise.all([
  fetch('/api/users', { signal: controller.signal }),
  fetch('/api/posts', { signal: controller.signal }),
  fetch('/api/comments', { signal: controller.signal })
])
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(([users, posts, comments]) => {
    console.log({ users, posts, comments });
  })
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('All requests aborted');
    }
  });

// This cancels all three requests
controller.abort();
```

Useful when you need to cancel a batch of related requests together.

## Things to know

AbortController only works with fetch and other APIs that support AbortSignal. XMLHttpRequest doesnt support it.

The abort signal cant be reused. Once you call abort() you need to create a new AbortController for new requests.

Not all fetch failures are AbortErrors. Always check the error name to distinguish between cancellation and actual network problems.

Some browsers might still send the request even after abort is called. The browser stops processing the response but the network request might complete on the server.

## Browser support

AbortController is supported in all modern browsers since 2019. If you need to support older browsers you can use a polyfill or check if AbortController exists:

```javascript
if (typeof AbortController !== 'undefined') {
  const controller = new AbortController();
  // Use abort controller
} else {
  // Fallback without cancellation
}
```

## Summary

AbortController lets you cancel fetch requests when they're no longer needed. Its useful for component cleanup, handling user input, and setting timeouts.

Use it in React useEffect cleanup functions to avoid state updates on unmounted components. For search and autocomplete it prevents unnecessary requests when users type quickly. The API is straightforward and supported in modern browsers without extra dependencies.
