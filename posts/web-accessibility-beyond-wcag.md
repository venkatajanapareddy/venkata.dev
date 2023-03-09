---
title: 'Web Accessibility Beyond WCAG Compliance'
date: '2023-03-08'
---

Many teams treat WCAG compliance as a checklist. Add alt text to images, check. Use semantic HTML, check. Pass an automated audit tool, check.

But accessibility is more than passing automated tests. Real users with disabilities might still struggle with your application even if it technically meets WCAG 2.1 AA standards. Compliance doesnt equal usability.

## Why compliance isnt enough

Automated tools catch maybe 30-40% of accessibility issues. They find missing alt text and color contrast problems. They dont catch confusing navigation or poor focus management.

WCAG provides minimum requirements. Meeting these requirements doesnt guarantee a good user experience. It's like saying a building is accessible because it has a ramp when the ramp is too steep to actually use.

## Focus management

One of the most common issues is poor focus management in dynamic applications. When content changes focus should move logically.

Opening a modal:

```javascript
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement;

      // Move focus to modal
      modalRef.current?.focus();
    } else if (previousFocusRef.current) {
      // Restore focus when closing
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

This moves focus into the modal when it opens and restores focus when it closes. Keyboard users dont lose their place.

## Live regions for dynamic content

When content updates dynamically screen readers might not announce changes. Use ARIA live regions:

```jsx
function StatusMessage({ message, type }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Usage
<StatusMessage message="Form submitted successfully" type="success" />
```

`aria-live="polite"` announces changes when the screen reader finishes current announcements. Use `aria-live="assertive"` for urgent updates like errors.

## Keyboard navigation patterns

Support common keyboard shortcuts users expect:

```javascript
function Table({ data }) {
  const handleKeyDown = (e) => {
    switch(e.key) {
      case 'Home':
        // Move to first cell
        break;
      case 'End':
        // Move to last cell
        break;
      case 'ArrowUp':
        // Move to cell above
        break;
      case 'ArrowDown':
        // Move to cell below
        break;
    }
  };

  return (
    <table onKeyDown={handleKeyDown}>
      {/* table content */}
    </table>
  );
}
```

Check ARIA Authoring Practices Guide for expected keyboard patterns for complex widgets.

## Screen reader testing

Automated tools dont tell you what screen readers actually announce. Test with real screen readers:

- **NVDA** (Windows, free)
- **JAWS** (Windows, paid)
- **VoiceOver** (Mac/iOS, built-in)
- **TalkBack** (Android, built-in)

Common issues you'll find:
- Unclear button labels ("Click here" vs "Open settings menu")
- Missing context ("Submit" vs "Submit feedback form")
- Overly verbose announcements
- Important information not announced
- Confusing navigation order

## Skip links

Skip links let keyboard users bypass repetitive navigation:

```jsx
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Skip to main content
    </a>
  );
}

// CSS to show only on focus
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

This appears when tabbing through the page and jumps past navigation when activated.

## Form accessibility

Forms are frequently inaccessible even when they meet technical requirements:

```jsx
function FormField({ label, error, required, ...props }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && <span aria-label="required">*</span>}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        aria-required={required}
        {...props}
      />
      {error && (
        <div id={errorId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
```

This connects labels, error messages, and required states properly. Screen readers announce all relevant information.

## Color and contrast

WCAG requires 4.5:1 contrast ratio for normal text. But context matters:

- Text over images needs higher contrast
- Small text needs more contrast than large text
- Light gray text might meet ratio but still be hard to read
- Don't rely only on color to convey information

Test contrast with actual use cases not just automated checkers.

## Animation and motion

Some users experience motion sickness from animations. Respect the prefers-reduced-motion setting:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Or use JavaScript to check:

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Disable animations
}
```

## Touch targets

WCAG requires touch targets be at least 44x44 pixels. But this minimum might still be too small for users with motor impairments.

Increase spacing between interactive elements. Make sure tap targets dont overlap.

```css
button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 24px; /* Exceeds minimum */
}
```

## Testing with real users

The best way to find accessibility issues is testing with users who rely on assistive technology. They'll find problems automated tools and developer testing miss.

If you cant do user testing:
- Use screen readers yourself
- Navigate with keyboard only
- Test with browser zoom at 200%
- Try with high contrast mode enabled
- Check with various text sizes

## Documentation for developers

Document accessibility requirements for your components:

```typescript
/**
 * Button component
 *
 * Accessibility:
 * - Always provide meaningful text or aria-label
 * - Use aria-describedby for additional context
 * - Loading state is announced to screen readers
 * - Disabled buttons are marked as aria-disabled
 *
 * Keyboard:
 * - Space or Enter to activate
 * - Escape to cancel if in a form
 */
export function Button({ ...props }) { }
```

This helps other developers maintain accessibility.

## Common mistakes

**Div soup**: Using divs with click handlers instead of buttons. Screen readers dont identify these as interactive.

**Missing labels**: Placeholder text isnt a label. Always provide actual labels.

**Automatic carousels**: These are hard for screen reader users and keyboard users to control.

**Custom select dropdowns**: Usually have broken keyboard navigation and screen reader support. Use native select when possible.

**Icon-only buttons**: Need text labels or aria-label. The icon might be obvious visually but screen readers need text.

## Priorities

If you cant fix everything at once prioritize:

1. Critical user flows (signup, checkout, etc)
2. Keyboard navigation
3. Screen reader support
4. Color contrast
5. Error messages and validation
6. Form labels and structure

## Summary

WCAG compliance is a starting point not the finish line. Real accessibility requires testing with assistive technology and considering actual user experiences.

Focus management, keyboard navigation, and screen reader testing reveal issues that automated tools miss. Test with real users when possible and always go beyond minimum requirements.
