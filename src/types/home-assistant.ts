export interface HassEntity {
  state: string;
  attributes: Record<string, any>;
  entity_id: string;
  last_changed: string;
  last_updated: string;
}

export interface EntityRegistryEntry {
  entity_id: string;
  device_id?: string;
  platform: string;
  disabled_by?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryEntry>;
  callService(domain: string, service: string, data: Record<string, unknown>): void;
  callWS(msg: Record<string, unknown>): Promise<unknown>;
}

export interface LovelaceCardConfig {
  type: string;
  entity?: string;
  name?: string;
  [key: string]: any;
}

export interface LovelaceCard {
  hass: HomeAssistant;
  setConfig(config: Record<string, any>): void;
  getCardSize(): number;
}

export interface LovelaceCardEditor {
  hass: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}

declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }
}

export {};
