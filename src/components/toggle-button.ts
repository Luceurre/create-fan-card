import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { mushroomTheme, mushroomCardStyle } from '../utils/mushroom-theme';

@customElement('create-fan-toggle')
export class CreateFanToggle extends LitElement {
  @property({ type: Boolean }) active = false;
  @property({ type: String }) icon = 'mdi:fan';
  @property({ type: String }) label = '';

  static get styles(): CSSResult[] {
    return [
      mushroomTheme,
      mushroomCardStyle,
      css`
        :host {
          display: inline-block;
        }
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--mush-control-height);
          height: var(--mush-control-height);
          border-radius: var(--mush-control-border-radius);
          border: none;
          background: rgba(var(--mush-rgb-info), 0.2);
          cursor: pointer;
          transition: background 0.2s ease;
          color: var(--mush-card-secondary-color);
          padding: 0;
        }
        button.active {
          background: rgba(var(--mush-rgb-active), 0.25);
          color: var(--primary-color);
        }
        button:hover {
          filter: brightness(1.1);
        }
        ha-icon {
          --mdi-icon-size: 20px;
        }
      `,
    ];
  }

  private _handleClick(e: Event) {
    e.stopPropagation(); // Prevent card tap from firing
    this.dispatchEvent(
      new CustomEvent('toggle-click', {
        bubbles: true,
        composed: true,
        detail: { active: this.active },
      })
    );
  }

  render() {
    return html`
      <button
        class="${this.active ? 'active' : ''}"
        @click=${this._handleClick}
        aria-label="${this.label}"
        title="${this.label}"
      >
        <ha-icon .icon=${this.icon}></ha-icon>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'create-fan-toggle': CreateFanToggle;
  }
}
