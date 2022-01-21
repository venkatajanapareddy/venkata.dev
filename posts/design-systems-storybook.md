---
title: 'Getting Started with Storybook and React'
date: '2022-02-18'
---

When building component libraries you often face the problem of maintaining consistency across different components. Each developer might build their own version of a Button or Card component. Then designers ask which version should they reference in Figma.

Storybook solves this by letting you develop and showcase UI components in isolation.

## What is Storybook

Storybook is basically a workshop for building React components outside of your main application. You can see all your components in one place and test different states without running the entire app.

## Setting up Storybook

First install Storybook in your React project:

```bash
npx storybook init
```

This command will detect that your using React and set everything up automatically. It creates a `.storybook` folder with configuration files.

After installation run:

```bash
npm run storybook
```

Storybook will start on `http://localhost:6006` and you'll see some example components.

## Creating your first story

Lets create a simple Button component. First the component itself:

```jsx
// components/Button.jsx
export const Button = ({ variant = 'primary', children, disabled }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

Now create a story file in the same folder:

```jsx
// components/Button.stories.jsx
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = () => <Button variant="primary">Click me</Button>;
export const Secondary = () => <Button variant="secondary">Click me</Button>;
export const Disabled = () => <Button disabled>Click me</Button>;
```

Refresh Storybook and you'll see your Button component with three different variations.

## Why this helps

The main benefit is documentation that stays current. Developers look at Storybook to see whats available instead of searching through code.

Designers can also browse Storybook to see what components already exist before creating new designs.

For testing its useful because QA can see all component states in one place.

## Storybook addons

There are many addons available. Some useful ones:

**Controls addon** - lets you change component props directly in the Storybook UI. Good for testing edge cases.

**Actions addon** - shows you when events fire. Useful for debugging click handlers and other interactions.

**A11y addon** - runs accessibility checks on your components. It flags issues like missing alt text or poor color contrast.

To install an addon run:

```bash
npm install @storybook/addon-a11y
```

Then add it to `.storybook/main.js`:

```javascript
module.exports = {
  addons: ['@storybook/addon-a11y']
};
```

## Things to know

If your using custom webpack configuration or CSS modules the setup can be tricky. You might need to update `.storybook/main.js` to match your build setup.

Remember to update stories when you change component APIs. Its easy to forget and then the stories dont match the actual components.

## Summary

Storybook is helpful for organizing component libraries. It takes some time to set up but makes it easier to build and maintain consistent components.

This is just a beginning with Storybook. There are many more features and addons available in the documentation.
