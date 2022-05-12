---
title: 'Promise.all vs Promise.race vs Promise.allSettled vs Promise.any'
date: '2022-05-12'
---

JavaScript has different Promise methods for handling multiple promises. Here's what each one does.

## Promise.all

Waits for all promises to resolve. If any promise rejects it fails immediately.

```javascript
Promise.all([
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/comments')
])
  .then(results => console.log('All done', results))
  .catch(error => console.log('One failed', error));
```

Use this when you need all results and cant proceed if anything fails.

## Promise.race

Returns as soon as the first promise settles. Doesnt matter if it resolves or rejects.

```javascript
const timeout = new Promise((resolve, reject) =>
  setTimeout(() => reject('Timeout'), 5000)
);

Promise.race([fetch('/api/data'), timeout])
  .then(data => console.log(data))
  .catch(error => console.log('Timed out or failed'));
```

Good for implementing timeouts.

## Promise.allSettled

Waits for all promises to finish and returns everything. Doesnt reject early like Promise.all.

```javascript
Promise.allSettled([
  fetch('/api/user'),
  fetch('/api/invalid'),
  fetch('/api/posts')
])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Success:', result.value);
      } else {
        console.log('Failed:', result.reason);
      }
    });
  });
```

Useful when you want to try multiple things and handle successes and failures separately. This one was added in ES2020 so its relatively new.

## Promise.any

Returns the first promise that resolves successfully. Ignores rejections unless everything fails.

```javascript
Promise.any([
  fetch('/api/server1/data'),
  fetch('/api/server2/data'),
  fetch('/api/server3/data')
])
  .then(data => console.log('Got data', data))
  .catch(error => console.log('All failed', error));
```

Good for trying multiple sources and using whichever works first. Added in ES2021.

## When to use what

`Promise.all` is the most common one. Use it when you need multiple async operations to complete before continuing.

`Promise.race` is useful for timeouts or when you only care about the fastest result.

`Promise.allSettled` is good when you want to attempt multiple operations and handle each result individually regardless of success or failure.

`Promise.any` is less common but useful for redundancy scenarios like multiple API servers.
