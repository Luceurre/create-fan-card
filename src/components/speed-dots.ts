import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { mushroomTheme } from '../utils/mushroom-theme';

@customElement('create-fan-speed-dots')
export class CreateFanSpeedDots extends LitElement {
  @property({ type: Number }) speed = 0; // 0 = off, 1-6 = speed level

  static get styles(): CSSResult[] {
    return [
      mushroomTheme,
      css`
        :host {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(var(--mush-rgb-info), 0.3);
          transition: background 0.2s ease;
        }
        .dot.active {
          background: rgba(var(--mush-rgb-state-fan), 0.9);
        }
      `,
    ];
  }

  render() {
    return html`
      ${[1, 2, 3, 4, 5, 6].map(
        (i) => html`<div class="dot ${i <= this.speed ? 'active' : ''}"></div>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'create-fan-speed-dots': CreateFanSpeedDots;
  }
}
