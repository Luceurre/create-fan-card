import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import type { FanEntities } from '../utils/device-entities';
import { isEntityOn, getFanSpeed, getTimerInfo } from '../utils/device-entities';
import {
  callFanToggle,
  callFanSpeed,
  callFanTurnOn,
  callLightToggle,
  callSelectOption,
  callSwitchToggle,
  callButtonPress,
} from '../utils/ha-service';
import { mushroomTheme } from '../utils/mushroom-theme';
import '../components/timer-display';

@customElement('create-fan-remote-popup')
export class CreateFanRemotePopup extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) entities?: FanEntities;

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

        /* Power button */
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

        /* Speed grid */
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

        /* Toggle rows */
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

        /* Pill groups */
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

        /* Timer */
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

  private _isFanOn(): boolean {
    if (!this.hass || !this.entities?.fan) return false;
    return isEntityOn(this.hass, this.entities.fan);
  }

  private _getCurrentSpeed(): string | undefined {
    if (!this.hass || !this.entities?.fan) return undefined;
    return getFanSpeed(this.hass, this.entities.fan);
  }

  private _getSelectedColor(): string | undefined {
    if (!this.hass || !this.entities?.color) return undefined;
    return this.hass.states[this.entities.color]?.state;
  }

  private _isDirectionClockwise(): boolean {
    if (!this.hass || !this.entities?.direction) return true;
    return isEntityOn(this.hass, this.entities.direction);
  }

  private _isMuteOn(): boolean {
    if (!this.hass || !this.entities?.mute) return false;
    return isEntityOn(this.hass, this.entities.mute);
  }

  private _getTimerData(): { duration: number; remaining: number } | undefined {
    if (!this.hass || !this.entities?.timer) return undefined;
    return getTimerInfo(this.hass, this.entities.timer);
  }

  private _handlePowerClick() {
    if (!this.hass || !this.entities?.fan) return;
    callFanToggle(this.hass, this.entities.fan);
  }

  private _handleSpeedClick(speed: number) {
    if (!this.hass || !this.entities?.fan) return;
    const wasOff = !this._isFanOn();
    const presetMode = `speed${speed}`;
    callFanSpeed(this.hass, this.entities.fan, presetMode);
    if (wasOff) {
      callFanTurnOn(this.hass, this.entities.fan);
    }
  }

  private _handleLightToggle() {
    if (!this.hass || !this.entities?.light) return;
    callLightToggle(this.hass, this.entities.light);
  }

  private _handleColorSelect(option: string) {
    if (!this.hass || !this.entities?.color) return;
    callSelectOption(this.hass, this.entities.color, option);
  }

  private _handleDirectionToggle() {
    if (!this.hass || !this.entities?.direction) return;
    callSwitchToggle(this.hass, this.entities.direction);
  }

  private _handleMuteToggle() {
    if (!this.hass || !this.entities?.mute) return;
    callSwitchToggle(this.hass, this.entities.mute);
  }

  private _handleTimerPress(entityId: string) {
    if (!this.hass) return;
    callButtonPress(this.hass, entityId);
  }

  private _hasCooldowns(): boolean {
    return !!(
      this.entities?.cooldown1h ||
      this.entities?.cooldown2h ||
      this.entities?.cooldown4h
    );
  }

  render() {
    if (!this.hass || !this.entities) return html``;

    const fanOn = this._isFanOn();
    const currentSpeed = this._getCurrentSpeed();

    return html`
      <!-- Section 1: Fan Power -->
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

      <!-- Section 2: Speed Selector -->
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

      <!-- Section 3: Light -->
      ${this.entities.light
        ? html`
            <div class="section">
              <div class="section-label">Light</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${'mdi:lightbulb'}></ha-icon>
                  <span>Light</span>
                </div>
                <button
                  class="power-btn ${isEntityOn(this.hass!, this.entities.light!) ? 'active' : ''}"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleLightToggle}
                  aria-label="Light toggle"
                >
                  ${isEntityOn(this.hass!, this.entities.light!) ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          `
        : ''}

      <!-- Section 4: Color -->
      ${this.entities.color
        ? html`
            <div class="section">
              <div class="section-label">Color</div>
              <div class="pill-group">
                <button
                  class="pill ${this._getSelectedColor() === 'white' ? 'active' : ''}"
                  @click=${() => this._handleColorSelect('white')}
                >
                  White
                </button>
                <button
                  class="pill ${this._getSelectedColor() === 'yellow' ? 'active' : ''}"
                  @click=${() => this._handleColorSelect('yellow')}
                >
                  Yellow
                </button>
              </div>
            </div>
          `
        : ''}

      <!-- Section 5: Direction -->
      ${this.entities.direction
        ? html`
            <div class="section">
              <div class="section-label">Direction</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${'mdi:rotate-3d-variant'}></ha-icon>
                  <span>${this._isDirectionClockwise() ? 'Clockwise' : 'Counter-clockwise'}</span>
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

      <!-- Section 6: Mute -->
      ${this.entities.mute
        ? html`
            <div class="section">
              <div class="section-label">Mute</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${'mdi:volume-off'}></ha-icon>
                  <span>Mute</span>
                </div>
                <button
                  class="power-btn ${this._isMuteOn() ? 'active' : ''}"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleMuteToggle}
                  aria-label="Mute toggle"
                >
                  ${this._isMuteOn() ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          `
        : ''}

      <!-- Section 7: Timers -->
      ${this._hasCooldowns()
        ? html`
            <div class="section">
              <div class="section-label">Timer</div>
              <div class="timer-row">
                ${this.entities.cooldown1h
                  ? html`
                      <button
                        class="timer-btn"
                        @click=${() => this._handleTimerPress(this.entities!.cooldown1h!)}
                      >
                        1h
                      </button>
                    `
                  : ''}
                ${this.entities.cooldown2h
                  ? html`
                      <button
                        class="timer-btn"
                        @click=${() => this._handleTimerPress(this.entities!.cooldown2h!)}
                      >
                        2h
                      </button>
                    `
                  : ''}
                ${this.entities.cooldown4h
                  ? html`
                      <button
                        class="timer-btn"
                        @click=${() => this._handleTimerPress(this.entities!.cooldown4h!)}
                      >
                        4h
                      </button>
                    `
                  : ''}
                ${this._getTimerData()?.remaining
                  ? html`
                      <create-fan-timer-display
                        .duration=${this._getTimerData()!.duration}
                        .remaining=${this._getTimerData()!.remaining}
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
    'create-fan-remote-popup': CreateFanRemotePopup;
  }
}
