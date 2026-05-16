import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './components/group-compact-card';
import './components/group-remote-popup';

import type { HomeAssistant, LovelaceCardConfig } from './types/home-assistant';
import type { FanEntities } from './utils/device-entities';
import { discoverFanEntities } from './utils/device-entities';
import { openPopup } from './utils/popup';

export interface CreateFanGroupCardConfig extends LovelaceCardConfig {
  entities: string[];
  name?: string;
}

interface CreateFanGroupRemotePopupCardConfig extends LovelaceCardConfig {
  fanEntitiesList?: FanEntities[];
}

@customElement('create-fan-group-remote-popup-card')
export class CreateFanGroupRemotePopupCard extends LitElement {
  @state() private _config?: CreateFanGroupRemotePopupCardConfig;
  @state() private _fanEntitiesList?: FanEntities[];
  private _hass?: HomeAssistant;

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      display: block;
      padding: 16px;
    }
  `;

  public set hass(hass: HomeAssistant | undefined) {
    const oldHass = this._hass;
    this._hass = hass;
    this.requestUpdate('hass', oldHass);
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  public setConfig(config: CreateFanGroupRemotePopupCardConfig): void {
    this._config = config;
    this._fanEntitiesList = config.fanEntitiesList;
  }

  public getCardSize(): number {
    return 6;
  }

  protected render() {
    if (!this._hass || !this._fanEntitiesList) {
      return html``;
    }

    return html`
      <ha-card>
        <create-fan-group-remote-popup
          .hass=${this._hass}
          .fanEntitiesList=${this._fanEntitiesList}
        ></create-fan-group-remote-popup>
      </ha-card>
    `;
  }
}

@customElement('create-fan-group-card')
export class CreateFanGroupCard extends LitElement {
  @state() private _config?: CreateFanGroupCardConfig;
  @state() private _fanEntitiesList?: FanEntities[];
  private _hass?: HomeAssistant;

  static styles = css`
    :host {
      display: block;
    }
  `;

  public static getStubConfig(): Record<string, unknown> {
    return { entities: [] };
  }

  public set hass(hass: HomeAssistant | undefined) {
    const oldHass = this._hass;
    this._hass = hass;

    if (hass && this._config) {
      this._fanEntitiesList = this._resolveEntities(hass, this._config);
    }

    this.requestUpdate('hass', oldHass);
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  public setConfig(config: CreateFanGroupCardConfig): void {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error('entities must be a non-empty array of fan entity IDs');
    }

    this._config = config;
    this._fanEntitiesList = this._hass ? this._resolveEntities(this._hass, config) : undefined;
  }

  public getCardSize(): number {
    return 3;
  }

  private _resolveEntities(hass: HomeAssistant, config: CreateFanGroupCardConfig): FanEntities[] {
    return config.entities.map(entityId => discoverFanEntities(hass, entityId));
  }

  private _getTitle(): string {
    if (!this._config) {
      return 'Fan Group';
    }

    return this._config.name ?? 'Fan Group';
  }

  private _handleOpenRemote(
    event: CustomEvent<{ fanEntitiesList: FanEntities[] }>,
  ): void {
    const firstFan = event.detail.fanEntitiesList[0]?.fan;
    openPopup(this, {
      title: this._getTitle(),
      content: {
        type: 'custom:create-fan-group-remote-popup-card',
        entity: firstFan,
        fanEntitiesList: event.detail.fanEntitiesList,
      },
    });
  }

  protected render() {
    if (!this._config || !this._hass) {
      return html``;
    }

    return html`
      <create-fan-group-compact-card
        .hass=${this._hass}
        .name=${this._config.name ?? ''}
        .fanEntitiesList=${this._fanEntitiesList ?? []}
        @open-remote=${this._handleOpenRemote}
      ></create-fan-group-compact-card>
    `;
  }
}

const windowWithCustomCards = window as any;
windowWithCustomCards.customCards = windowWithCustomCards.customCards || [];
const customCards = windowWithCustomCards.customCards as Array<{
  type: string;
  name: string;
  description: string;
}>;

if (
  !customCards.some(
    (card: { type: string }) => card.type === 'create-fan-group-card',
  )
) {
  customCards.push({
    type: 'create-fan-group-card',
    name: 'Create Fan Group Card',
    description: 'A Mushroom-styled group card for controlling multiple Create Ikohs ceiling fans',
  });
}

declare global {
  interface HTMLElementTagNameMap {
    'create-fan-group-card': CreateFanGroupCard;
    'create-fan-group-remote-popup-card': CreateFanGroupRemotePopupCard;
  }
}
