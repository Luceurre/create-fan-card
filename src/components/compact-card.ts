import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import type { FanEntities } from '../utils/device-entities';
import { isEntityOn, getFanSpeed, getTimerInfo } from '../utils/device-entities';
import { callFanToggle, callLightToggle } from '../utils/ha-service';
import { mushroomTheme, mushroomCardStyle } from '../utils/mushroom-theme';

import './speed-dots';
import './timer-display';

@customElement('create-fan-compact-card')
export class CreateFanCompactCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) entityId = '';
  @property({ type: String }) name = '';
  @property({ attribute: false }) entities?: FanEntities;

  static get styles(): CSSResult[] {
    return [
      mushroomTheme,
      mushroomCardStyle,
      css`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .icons-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .shape-icon {
          cursor: pointer;
          background: rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.05);
          color: var(--primary-text-color);
        }
        .shape-icon.on {
          background: rgba(var(--mush-rgb-state-fan), 0.2);
          color: rgb(var(--mush-rgb-state-fan));
        }
        .shape-icon.on ha-icon {
          animation: spin 1.5s linear infinite;
        }
        .shape-icon.light-on {
          background: rgba(var(--mush-rgb-state-light), 0.2);
          color: rgb(var(--mush-rgb-state-light));
        }
        .secondary-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }
      `,
    ];
  }

  private _getDisplayName(): string {
    if (this.name) return this.name;
    if (!this.hass || !this.entityId) return '';
    return this.hass.states[this.entityId]?.attributes?.friendly_name ?? this.entityId;
  }

  private _isFanOn(): boolean {
    if (!this.hass || !this.entityId) return false;
    return isEntityOn(this.hass, this.entityId);
  }

  private _getSpeed(): number {
    if (!this.hass || !this.entityId) return 0;
    const preset = getFanSpeed(this.hass, this.entityId);
    if (!preset) return 0;
    const match = preset.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private _isLightOn(): boolean {
    if (!this.hass || !this.entities?.light) return false;
    return isEntityOn(this.hass, this.entities.light);
  }

  private _getTimerData(): { duration: number; remaining: number } {
    if (!this.hass || !this.entities?.timer) {
      return { duration: 0, remaining: 0 };
    }
    const info = getTimerInfo(this.hass, this.entities.timer);
    return info ?? { duration: 0, remaining: 0 };
  }

  private _onFanToggle(e: Event): void {
    e.stopPropagation();
    if (this.hass && this.entities?.fan) {
      callFanToggle(this.hass, this.entities.fan);
    }
  }

  private _onLightToggle(e: Event): void {
    e.stopPropagation();
    if (this.hass && this.entities?.light) {
      callLightToggle(this.hass, this.entities.light);
    }
  }

  private _openRemote(): void {
    this.dispatchEvent(
      new CustomEvent('open-remote', {
        bubbles: true,
        composed: true,
        detail: {
          entityId: this.entityId,
          entities: this.entities,
        },
      })
    );
  }

  render() {
    if (!this.hass || !this.entityId) return html``;

    const displayName = this._getDisplayName();
    const fanOn = this._isFanOn();
    const speed = this._getSpeed();
    const lightOn = this._isLightOn();
    const hasLight = !!this.entities?.light;
    const hasTimer = !!this.entities?.timer;
    const timerData = this._getTimerData();

    return html`
      <ha-card>
        <div class="card-content" @click=${this._openRemote}>
          <div class="icons-row">
            <div class="shape-icon ${fanOn ? 'on' : ''}" @click=${this._onFanToggle}>
              <ha-icon .icon=${'mdi:fan'}></ha-icon>
            </div>
            ${hasLight
              ? html`<div class="shape-icon light ${lightOn ? 'light-on' : ''}" @click=${this._onLightToggle}>
                  <ha-icon .icon=${'mdi:lightbulb'}></ha-icon>
                </div>`
              : ''}
          </div>
          <div class="state-info">
            <span class="primary">${displayName}</span>
            <div class="secondary-row">
              <create-fan-speed-dots .speed=${speed}></create-fan-speed-dots>
              ${hasTimer
                ? html`<create-fan-timer-display
                    .duration=${timerData.duration}
                    .remaining=${timerData.remaining}
                  ></create-fan-timer-display>`
                : ''}
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'create-fan-compact-card': CreateFanCompactCard;
  }
}
