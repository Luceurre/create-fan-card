import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import type { FanEntities } from '../utils/device-entities';
import { getGroupState } from '../utils/group-state';
import type { GroupFanState } from '../utils/group-state';
import {
  groupFanToggle,
  groupFanTurnOn,
  groupFanSpeed,
  groupLightToggle,
  groupColorSelect,
  groupDirectionToggle,
  groupMuteToggle,
  groupTimerPress,
} from '../utils/group-service';
import { mushroomTheme } from '../utils/mushroom-theme';
import '../components/timer-display';

@customElement('create-fan-group-remote-popup')
export class CreateFanGroupRemotePopup extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) fanEntitiesList?: FanEntities[];

  static get styles(): CSSResult[] {
    return [
      mushroomTheme,
      css`
        :host {
          display: block;
          padding: 8px 0;
        }
        .section {
          margin-bottom: 16px;
        }
        .section-label {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--mush-card-secondary-color);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .power-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 48px;
          border-radius: var(--mush-control-border-radius);
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .power-btn.active {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: var(--primary-color);
        }
        .power-btn:hover {
          filter: brightness(1.1);
        }

        .speed-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .speed-btn {
          height: var(--mush-control-height);
          border-radius: var(--mush-control-border-radius);
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .speed-btn.active {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: var(--primary-color);
        }
        .speed-btn:hover {
          filter: brightness(1.1);
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
        }
        .toggle-row-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--mush-card-primary-color);
          font-size: 14px;
        }

        .pill-group {
          display: flex;
          gap: 4px;
        }
        .pill {
          padding: 6px 16px;
          border-radius: 20px;
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 13px;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .pill.active {
          background: rgba(var(--mush-rgb-active), 0.25);
          color: var(--primary-color);
        }

        .timer-row {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .timer-btn {
          padding: 6px 16px;
          border-radius: 20px;
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 13px;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .timer-btn:hover {
          filter: brightness(1.1);
        }
      `,
    ];
  }

  private _getGroupState(): GroupFanState | null {
    if (!this.hass || !this.fanEntitiesList?.length) return null;
    return getGroupState(this.hass, this.fanEntitiesList);
  }

  private _handlePowerClick() {
    if (!this.hass || !this.fanEntitiesList?.length) return;
    groupFanToggle(this.hass, this.fanEntitiesList);
  }

  private _handleSpeedClick(speed: number) {
    if (!this.hass || !this.fanEntitiesList?.length) return;
    const state = this._getGroupState();
    const wasOff = state && !state.fanOn;
    groupFanSpeed(this.hass, this.fanEntitiesList, `speed${speed}`);
    if (wasOff) {
      groupFanTurnOn(this.hass, this.fanEntitiesList);
    }
  }

  private _handleLightToggle() {
    if (!this.hass || !this.fanEntitiesList?.length) return;
    groupLightToggle(this.hass, this.fanEntitiesList);
  }

  private _handleColorSelect(option: string) {
    if (!this.hass || !this.fanEntitiesList?.length) return;
    groupColorSelect(this.hass, this.fanEntitiesList, option);
  }

  private _handleDirectionToggle() {
    if (!this.hass || !this.fanEntitiesList?.length) return;
    groupDirectionToggle(this.hass, this.fanEntitiesList);
  }

  private _handleMuteToggle() {
    if (!this.hass || !this.fanEntitiesList?.length) return;
    groupMuteToggle(this.hass, this.fanEntitiesList);
  }

  private _handleTimerPress() {
    if (!this.hass || !this.fanEntitiesList?.length) return;
    groupTimerPress(this.hass, this.fanEntitiesList);
  }

  private _hasCooldowns(state: GroupFanState): boolean {
    return state.hasCooldowns;
  }

  render() {
    if (!this.hass || !this.fanEntitiesList?.length) return html``;

    const state = this._getGroupState();
    if (!state) return html``;

    const fanOn = state.fanOn;
    const currentSpeed = state.speedPreset;

    return html`
      <div class="section">
        <div class="section-label">Power</div>
        <button
          class="power-btn ${fanOn ? 'active' : ''}"
          @click=${this._handlePowerClick}
          aria-label="Fan power toggle"
        >
          ${fanOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <div class="section">
        <div class="section-label">Speed</div>
        <div class="speed-grid">
          ${[1, 2, 3, 4, 5, 6].map(
            (speed) => html`
              <button
                class="speed-btn ${currentSpeed === `speed${speed}` ? 'active' : ''}"
                @click=${() => this._handleSpeedClick(speed)}
                aria-label="Speed ${speed}"
              >
                ${speed}
              </button>
            `,
          )}
        </div>
      </div>

      ${state.hasLight
        ? html`
            <div class="section">
              <div class="section-label">Light</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${'mdi:lightbulb'}></ha-icon>
                  <span>Light</span>
                </div>
                <button
                  class="power-btn ${state.lightOn ? 'active' : ''}"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleLightToggle}
                  aria-label="Light toggle"
                >
                  ${state.lightOn ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          `
        : ''}

      ${state.hasColor
        ? html`
            <div class="section">
              <div class="section-label">Color</div>
              <div class="pill-group">
                <button
                  class="pill ${state.color === 'cold' ? 'active' : ''}"
                  @click=${() => this._handleColorSelect('cold')}
                >
                  Cold
                </button>
                <button
                  class="pill ${state.color === 'white' ? 'active' : ''}"
                  @click=${() => this._handleColorSelect('white')}
                >
                  White
                </button>
                <button
                  class="pill ${state.color === 'warm' ? 'active' : ''}"
                  @click=${() => this._handleColorSelect('warm')}
                >
                  Warm
                </button>
              </div>
            </div>
          `
        : ''}

      ${state.hasDirection
        ? html`
            <div class="section">
              <div class="section-label">Direction</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${'mdi:rotate-3d-variant'}></ha-icon>
                  <span>${state.directionClockwise ? 'Clockwise' : 'Counter-clockwise'}</span>
                </div>
                <button
                  class="power-btn"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleDirectionToggle}
                  aria-label="Direction toggle"
                >
                  Toggle
                </button>
              </div>
            </div>
          `
        : ''}

      ${state.hasMute
        ? html`
            <div class="section">
              <div class="section-label">Mute</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${'mdi:volume-off'}></ha-icon>
                  <span>Mute</span>
                </div>
                <button
                  class="power-btn ${state.muteOn ? 'active' : ''}"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleMuteToggle}
                  aria-label="Mute toggle"
                >
                  ${state.muteOn ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          `
        : ''}

      ${this._hasCooldowns(state)
        ? html`
            <div class="section">
              <div class="section-label">Timer</div>
              <div class="timer-row">
                ${state.hasCooldown1h
                  ? html`
                      <button
                        class="timer-btn"
                        @click=${() => this._handleTimerPress()}
                      >
                        1h
                      </button>
                    `
                  : ''}
                ${state.hasCooldown2h
                  ? html`
                      <button
                        class="timer-btn"
                        @click=${() => this._handleTimerPress()}
                      >
                        2h
                      </button>
                    `
                  : ''}
                ${state.hasCooldown4h
                  ? html`
                      <button
                        class="timer-btn"
                        @click=${() => this._handleTimerPress()}
                      >
                        4h
                      </button>
                    `
                  : ''}
                ${state.timerData.remaining
                  ? html`
                      <create-fan-timer-display
                        .duration=${state.timerData.duration}
                        .remaining=${state.timerData.remaining}
                      ></create-fan-timer-display>
                    `
                  : ''}
              </div>
            </div>
          `
        : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'create-fan-group-remote-popup': CreateFanGroupRemotePopup;
  }
}
