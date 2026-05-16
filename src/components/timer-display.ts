import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { mushroomTheme } from '../utils/mushroom-theme';

@customElement('create-fan-timer-display')
export class CreateFanTimerDisplay extends LitElement {
  @property({ type: Number }) duration = 0;   // total minutes
  @property({ type: Number }) remaining = 0;  // remaining minutes

  static get styles(): CSSResult[] {
    return [
      mushroomTheme,
      css`
        :host {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--mush-card-secondary-color);
          font-size: 12px;
        }
        :host([hidden]) {
          display: none;
        }
        ha-icon {
          --mdi-icon-size: 14px;
          color: var(--mush-card-secondary-color);
        }
      `,
    ];
  }

  private _formatTime(minutes: number): string {
    if (minutes <= 0) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  }

  render() {
    if (this.duration === 0 || this.remaining <= 0) {
      return html``;
    }
    return html`
      <ha-icon .icon=${'mdi:timer-outline'}></ha-icon>
      <span>${this._formatTime(this.remaining)}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'create-fan-timer-display': CreateFanTimerDisplay;
  }
}
