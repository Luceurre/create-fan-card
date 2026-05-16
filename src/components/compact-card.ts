import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import type { FanEntities } from '../utils/device-entities';
import { isEntityOn, getFanSpeed, getTimerInfo } from '../utils/device-entities';
import { callFanToggle, callLightToggle } from '../utils/ha-service';
import { mushroomTheme, mushroomCardStyle } from '../utils/mushroom-theme';

import './toggle-button';
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
        .shape-icon.on {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: rgb(var(--mush-rgb-state-fan));
        }
        .shape-icon.on ha-icon {
          animation: spin 1.5s linear infinite;
        }
        .shape-icon {
          cursor: pointer;
        }
        .secondary-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }
        .card-actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-left: auto;
          flex-shrink: 0;
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

  private _onFanToggle(e: CustomEvent<{ active: boolean }>): void {
    e.stopPropagation();
    if (this.hass && this.entities?.fan) {
      callFanToggle(this.hass, this.entities.fan);
    }
  }

  private _onLightToggle(e: CustomEvent<{ active: boolean }>): void {
    e.stopPropagation();
    if (this.hass && this.entities?.light) {
      callLightToggle(this.hass, this.entities.light);
    }
  }

  private _onIconClick(e: Event): void {
    e.stopPropagation();
    if (this.hass && this.entities?.fan) {
      callFanToggle(this.hass, this.entities.fan);
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
    const speedText = speed > 0 ? `Speed ${speed}` : 'Off';

    return html`
      <ha-card>
        <div class="card-content" @click=${this._openRemote}>
          <div class="shape-icon ${fanOn ? 'on' : ''}" @click=${this._onIconClick}>
            <ha-icon .icon=${'mdi:fan'}></ha-icon>
          </div>
          <div class="state-info">
            <span class="primary">${displayName}</span>
            <div class="secondary-row">
              <span class="secondary">${speedText}</span>
              <create-fan-speed-dots .speed=${speed}></create-fan-speed-dots>
              ${hasTimer
                ? html`<create-fan-timer-display
                    .duration=${timerData.duration}
                    .remaining=${timerData.remaining}
                  ></create-fan-timer-display>`
                : ''}
            </div>
          </div>
          <div class="card-actions">
            <create-fan-toggle
              .active=${fanOn}
              .icon=${'mdi:fan'}
              .label=${'Fan'}
              .type=${'fan'}
              @toggle-click=${this._onFanToggle}
            ></create-fan-toggle>
            ${hasLight
              ? html`<create-fan-toggle
                  .active=${lightOn}
                  .icon=${'mdi:lightbulb'}
                  .label=${'Light'}
                  .type=${'light'}
                  @toggle-click=${this._onLightToggle}
                ></create-fan-toggle>`
              : ''}
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
