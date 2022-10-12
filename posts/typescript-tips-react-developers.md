---
title: 'TypeScript Tips for React Developers'
date: '2022-10-12'
---

TypeScript adds type checking to JavaScript. For React developers this means catching errors before runtime and getting better autocomplete in your editor.

If you're used to plain JavaScript the type syntax can feel overwhelming at first. Here are some practical tips that make working with TypeScript in React easier.

## Props typing patterns

The most common task is typing component props. Start simple with an interface:

```tsx
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
```

The `?` makes a prop optional. You can provide a default value in the destructuring.

## Children prop

For components that accept children use `React.ReactNode`:

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

`ReactNode` covers strings, numbers, elements, and arrays of these types.

## Event handlers

Event types in React can be confusing. Here's the pattern for common events:

```tsx
interface FormProps {
  onSubmit: (data: FormData) => void;
}

function Form({ onSubmit }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

The generic parameter (`<HTMLFormElement>`) specifies which element the event came from.

## State typing

useState infers types from the initial value. But sometimes you need to be explicit:

```tsx
// Type is inferred as number
const [count, setCount] = useState(0);

// Type is inferred as string
const [name, setName] = useState('');

// Explicit type when initial value is null
const [user, setUser] = useState<User | null>(null);

interface User {
  id: number;
  name: string;
  email: string;
}
```

Use explicit types when the initial value doesnt match the eventual type. This is common with API data that starts as null.

## Props with component composition

When components accept other components as props use `React.ComponentType`:

```tsx
interface LayoutProps {
  Header: React.ComponentType;
  children: React.ReactNode;
}

function Layout({ Header, children }: LayoutProps) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}
```

If the component needs props use a generic:

```tsx
interface LayoutProps<T> {
  Header: React.ComponentType<T>;
  headerProps: T;
  children: React.ReactNode;
}

function Layout<T>({ Header, headerProps, children }: LayoutProps<T>) {
  return (
    <div>
      <Header {...headerProps} />
      <main>{children}</main>
    </div>
  );
}
```

## Extending HTML attributes

To add custom props while keeping standard HTML attributes use intersection types:

```tsx
interface CustomButtonProps {
  variant: 'primary' | 'secondary';
  loading?: boolean;
}

type ButtonProps = CustomButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ variant, loading, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={loading}
      {...rest}
    >
      {loading ? 'Loading...' : rest.children}
    </button>
  );
}
```

Now the component accepts all standard button props plus your custom ones.

## Ref typing

When using refs you need to specify the element type:

```tsx
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
```

The `?` operator is optional chaining. It handles the case where ref.current might be null.

## Generic components

For components that work with different data types use generics:

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
/>
```

TypeScript infers the type from the items array.

## Common mistakes to avoid

You should avoid using `any` unless absolutely necessary. It defeats the purpose of TypeScript. Use `unknown` if you really dont know the type:

```tsx
// Bad
const handleData = (data: any) => {
  // ...
};

// Better
const handleData = (data: unknown) => {
  if (typeof data === 'string') {
    // TypeScript knows data is string here
  }
};
```

You dont need to type every single thing. Let TypeScript infer types when it can:

```tsx
// Unnecessary
const [count, setCount] = useState<number>(0);

// Better - type is inferred
const [count, setCount] = useState(0);
```

Avoid ignoring errors with `@ts-ignore`. Fix the underlying type issue instead.

## Helpful VSCode settings

Enable strict mode in tsconfig.json:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

This catches more errors but requires more explicit typing.

## Summary

TypeScript improves React development by catching errors early and improving editor support. Start with simple prop types and gradually add more sophisticated patterns.

The learning curve is real but the benefits show up quickly. Your editor helps more and runtime errors decrease. These tips cover common patterns but the TypeScript documentation has more details on advanced types.
