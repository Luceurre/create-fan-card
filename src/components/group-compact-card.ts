import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import type { FanEntities } from '../utils/device-entities';
import { getGroupState } from '../utils/group-state';
import type { GroupFanState } from '../utils/group-state';
import { groupFanToggle, groupLightToggle } from '../utils/group-service';
import { mushroomTheme, mushroomCardStyle } from '../utils/mushroom-theme';

import './speed-dots';
import './timer-display';

@customElement('create-fan-group-compact-card')
export class CreateFanGroupCompactCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) name = '';
  @property({ attribute: false }) fanEntitiesList?: FanEntities[];

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
        }
        .shape-icon.on {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: rgb(var(--mush-rgb-state-fan));
        }
        .shape-icon.on ha-icon {
          animation: spin 1.5s linear infinite;
        }
        .shape-icon.light-on {
          background: rgba(var(--mush-rgb-state-light), 0.25);
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

  private _getGroupState(): GroupFanState | null {
    if (!this.hass || !this.fanEntitiesList?.length) return null;
    return getGroupState(this.hass, this.fanEntitiesList);
  }

  private _onFanToggle(e: Event): void {
    e.stopPropagation();
    if (this.hass && this.fanEntitiesList?.length) {
      groupFanToggle(this.hass, this.fanEntitiesList);
    }
  }

  private _onLightToggle(e: Event): void {
    e.stopPropagation();
    if (this.hass && this.fanEntitiesList?.length) {
      groupLightToggle(this.hass, this.fanEntitiesList);
    }
  }

  private _openRemote(): void {
    this.dispatchEvent(
      new CustomEvent('open-remote', {
        bubbles: true,
        composed: true,
        detail: {
          fanEntitiesList: this.fanEntitiesList,
        },
      })
    );
  }

  render() {
    if (!this.hass || !this.fanEntitiesList?.length) return html``;

    const state = this._getGroupState();
    if (!state) return html``;

    const fanOn = state.fanOn;
    const speed = state.speed;
    const lightOn = state.lightOn;
    const hasLight = state.hasLight;
    const hasTimer = state.hasTimer;
    const timerData = state.timerData;
    const speedText = speed > 0 ? `Speed ${speed}` : (speed === -1 ? 'Mixed' : 'Off');

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
            <span class="primary">${this.name}</span>
            <div class="secondary-row">
              <span class="secondary">${speedText}</span>
              <create-fan-speed-dots .speed=${speed === -1 ? 0 : speed}></create-fan-speed-dots>
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
    'create-fan-group-compact-card': CreateFanGroupCompactCard;
  }
}
