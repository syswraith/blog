# Content styling

```tsx
<div
 style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }}
>
```

# Avoid mutation

It's better to do this. If you call `setCount(count + 1)` three times in one function, each call "sees" the same initial value of `count` from the current render cycle. For example, if `count` is 0, all three calls effectively become `setCount(0 + 1)`, and the final state becomes 1 instead of 3.

```tsx
<button
  style={{ height: "50px", width: "50px", margin: "10px" }}
  onClick={() => {
    setState((prevState) => {
      return { count: prevState.count + 1, color: "pink" }
    })
  }}
>
  +
</button>
```

# Input handling

```tsx
  const [inputContent, setInput] = useState("")

  return (
    <div>
      <input value={inputContent}
        onChange={event => {
          setInput(
            () => {
              return event.target.value;
            }
          );
        }}
      ></input>
      <p style={{
        backgroundColor: (inputContent.includes("yay")) ? "blue" : "",
      }}>
        {(inputContent.includes("yay")) ? "string is :)" : "string is :("}
      </p>
    </div>

```

# Pass functions to avoid recalculations

- `useState` will use a function when it doesn't have to re-render a value every time, will only run the first time a component is rendered.
- This has to be PASSED not called i.e. `useState(func)` instead of `useState(func())`

```tsx
// instead of complicating it like this just declare them as two different states
const [state, setState] = useState({ count: 0, color: "red" })
const count = state.count
const color = state.color
```

# useRef

Persist across renders. Rendering is not affected.

```tsx
const time = useRef(0)
console.log(time.current) // refers to the current
time.current = 10 // mutable
```

# Return type unknown

```tsx
ReturnType<typeof setInterval>
```
