# JavaScript Components

## imc-tag Web Component

A custom web component that renders a tag with centered text, black border, and rounded ends.

### Usage

```html
<!-- Include the component -->
<script src="/js/imc-tag.js"></script>

<!-- Use the component -->
<imc-tag name="JavaScript"></imc-tag>
<imc-tag name="HTML"></imc-tag>
<imc-tag name="CSS"></imc-tag>
```

### Attributes

- `name` - The text to display in the tag

### Features

- Centered text display
- Black 2px solid border
- Pill-shaped with fully rounded ends
- Inline display (can be used within text)
- Shadow DOM for style encapsulation
- XSS protection (safe text rendering)
- Reactive to attribute changes

### Demo

See `/demos/imc-tag-demo.html` for a working demo with various examples.
