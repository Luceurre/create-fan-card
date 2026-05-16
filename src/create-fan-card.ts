import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './components/compact-card';
import './components/remote-popup';

import type { HomeAssistant, LovelaceCardConfig } from './types/home-assistant';
import type { FanEntities } from './utils/device-entities';
import { discoverFanEntities } from './utils/device-entities';
import { openPopup } from './utils/popup';

export interface CreateFanCardConfig extends LovelaceCardConfig {
  entity: string;
  light_entity?: string;
  name?: string;
}

interface CreateFanRemotePopupCardConfig extends LovelaceCardConfig {
  entity: string;
  entities?: FanEntities;
}

@customElement('create-fan-remote-popup-card')
export class CreateFanRemotePopupCard extends LitElement {
  @state() private _config?: CreateFanRemotePopupCardConfig;
  @state() private _entities?: FanEntities;
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

    if (hass && this._config) {
      this._entities = this._resolveEntities(hass, this._config);
    }

    this.requestUpdate('hass', oldHass);
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  public setConfig(config: CreateFanRemotePopupCardConfig): void {
    if (!config.entity && !config.entities?.fan) {
      throw new Error('entity is required');
    }

    this._config = config;

    if (this._hass) {
      this._entities = this._resolveEntities(this._hass, config);
    }
  }

  public getCardSize(): number {
    return 6;
  }

  private _resolveEntities(
    hass: HomeAssistant,
    config: CreateFanRemotePopupCardConfig,
  ): FanEntities {
    if (config.entities) {
      return config.entities;
    }

    return discoverFanEntities(hass, config.entity);
  }

  protected render() {
    if (!this._hass || !this._entities) {
      return html``;
    }

    return html`
      <ha-card>
        <create-fan-remote-popup
          .hass=${this._hass}
          .entities=${this._entities}
        ></create-fan-remote-popup>
      </ha-card>
    `;
  }
}

@customElement('create-fan-card')
export class CreateFanCard extends LitElement {
  @state() private _config?: CreateFanCardConfig;
  @state() private _entities?: FanEntities;
  private _hass?: HomeAssistant;

  static styles = css`
    :host {
      display: block;
    }
  `;

  public static getStubConfig(): Record<string, unknown> {
    return { entity: '' };
  }

  public set hass(hass: HomeAssistant | undefined) {
    const oldHass = this._hass;
    this._hass = hass;

    if (hass && this._config) {
      this._entities = this._resolveEntities(hass, this._config);
    }

    this.requestUpdate('hass', oldHass);
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  public setConfig(config: CreateFanCardConfig): void {
    if (!config.entity) {
      throw new Error('entity is required');
    }

    this._config = config;
    this._entities = this._hass ? this._resolveEntities(this._hass, config) : undefined;
  }

  public getCardSize(): number {
    return 3;
  }

  private _resolveEntities(hass: HomeAssistant, config: CreateFanCardConfig): FanEntities {
    const entities = discoverFanEntities(hass, config.entity);

    if (config.light_entity) {
      return { ...entities, light: config.light_entity };
    }

    return entities;
  }

  private _getTitle(): string {
    if (!this._config) {
      return 'Fan Remote';
    }

    return (
      this._config.name ??
      this._hass?.states[this._config.entity]?.attributes?.friendly_name ??
      'Fan Remote'
    );
  }

  private _handleOpenRemote(
    event: CustomEvent<{ entityId: string; entities?: FanEntities }>,
  ): void {
    openPopup(this, {
      title: this._getTitle(),
      content: {
        type: 'custom:create-fan-remote-popup-card',
        entity: event.detail.entityId,
        entities: event.detail.entities,
      },
    });
  }

  protected render() {
    if (!this._config || !this._hass) {
      return html``;
    }

    return html`
      <create-fan-compact-card
        .hass=${this._hass}
        .entityId=${this._config.entity}
        .name=${this._config.name ?? ''}
        .entities=${this._entities}
        @open-remote=${this._handleOpenRemote}
      ></create-fan-compact-card>
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
    (card: { type: string }) => card.type === 'create-fan-card',
  )
) {
  customCards.push({
    type: 'create-fan-card',
    name: 'Create Fan Card',
    description: 'A Mushroom-styled card for controlling Create Ikohs ceiling fans',
  });
}

declare global {
  interface HTMLElementTagNameMap {
    'create-fan-card': CreateFanCard;
    'create-fan-remote-popup-card': CreateFanRemotePopupCard;
  }
}
