/**
 * imc-tag web component
 * Displays a tag with a centered name, black border, and rounded ends
 */
class ImcTag extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const name = this.getAttribute('name') || '';
    
    // Create elements safely to prevent XSS
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        .tag-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5em 1em;
          border: 2px solid black;
          border-radius: 9999px;
          text-align: center;
          min-width: 50px;
        }
      </style>
      <div class="tag-container">
        <span></span>
      </div>
    `;
    
    // Set text content safely
    const span = this.shadowRoot.querySelector('span');
    span.textContent = name;
  }
}

customElements.define('imc-tag', ImcTag);
