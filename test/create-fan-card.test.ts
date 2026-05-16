import { afterEach, describe, expect, it, vi } from 'vitest';

import '../src/create-fan-card';

import type { HomeAssistant } from '../src/types/home-assistant';
import type { CreateFanCardConfig } from '../src/create-fan-card';
import type { FanEntities } from '../src/utils/device-entities';

type CreateFanCardElement = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(config: CreateFanCardConfig): void;
  getCardSize(): number;
  updateComplete: Promise<void>;
  _config?: CreateFanCardConfig;
  _entities?: FanEntities;
};

type CompactCardElement = HTMLElement & {
  hass?: HomeAssistant;
  entityId: string;
  name: string;
  entities?: FanEntities;
};

function createMockHass(): HomeAssistant {
  return {
    states: {
      'fan.test_fan': {
        state: 'on',
        attributes: {
          friendly_name: 'Living Room Fan',
          preset_mode: 'speed3',
        },
        entity_id: 'fan.test_fan',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'light.test_fan_light': {
        state: 'off',
        attributes: { friendly_name: 'Fan Light' },
        entity_id: 'light.test_fan_light',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'select.test_fan_color': {
        state: 'white',
        attributes: {},
        entity_id: 'select.test_fan_color',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'switch.test_fan_direction': {
        state: 'on',
        attributes: {},
        entity_id: 'switch.test_fan_direction',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'switch.test_fan_mute': {
        state: 'off',
        attributes: {},
        entity_id: 'switch.test_fan_mute',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'sensor.test_fan_timer': {
        state: JSON.stringify({ duration: 14400, remaining: 3600 }),
        attributes: {},
        entity_id: 'sensor.test_fan_timer',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'button.test_fan_cooldown_1h': {
        state: 'idle',
        attributes: {},
        entity_id: 'button.test_fan_cooldown_1h',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'button.test_fan_cooldown_2h': {
        state: 'idle',
        attributes: {},
        entity_id: 'button.test_fan_cooldown_2h',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'button.test_fan_cooldown_4h': {
        state: 'idle',
        attributes: {},
        entity_id: 'button.test_fan_cooldown_4h',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
    },
    entities: {
      'fan.test_fan': {
        entity_id: 'fan.test_fan',
        device_id: 'device-1',
        platform: 'demo',
      },
      'light.test_fan_light': {
        entity_id: 'light.test_fan_light',
        device_id: 'device-1',
        platform: 'demo',
      },
      'select.test_fan_color': {
        entity_id: 'select.test_fan_color',
        device_id: 'device-1',
        platform: 'demo',
      },
      'switch.test_fan_direction': {
        entity_id: 'switch.test_fan_direction',
        device_id: 'device-1',
        platform: 'demo',
      },
      'switch.test_fan_mute': {
        entity_id: 'switch.test_fan_mute',
        device_id: 'device-1',
        platform: 'demo',
      },
      'sensor.test_fan_timer': {
        entity_id: 'sensor.test_fan_timer',
        device_id: 'device-1',
        platform: 'demo',
      },
      'button.test_fan_cooldown_1h': {
        entity_id: 'button.test_fan_cooldown_1h',
        device_id: 'device-1',
        platform: 'demo',
      },
      'button.test_fan_cooldown_2h': {
        entity_id: 'button.test_fan_cooldown_2h',
        device_id: 'device-1',
        platform: 'demo',
      },
      'button.test_fan_cooldown_4h': {
        entity_id: 'button.test_fan_cooldown_4h',
        device_id: 'device-1',
        platform: 'demo',
      },
      'fan.other_fan': {
        entity_id: 'fan.other_fan',
        device_id: 'device-2',
        platform: 'demo',
      },
    },
    callService: vi.fn(),
    callWS: vi.fn().mockResolvedValue(null),
  };
}

function createExpectedEntities(): FanEntities {
  return {
    fan: 'fan.test_fan',
    light: 'light.test_fan_light',
    color: 'select.test_fan_color',
    direction: 'switch.test_fan_direction',
    mute: 'switch.test_fan_mute',
    timer: 'sensor.test_fan_timer',
    cooldown1h: 'button.test_fan_cooldown_1h',
    cooldown2h: 'button.test_fan_cooldown_2h',
    cooldown4h: 'button.test_fan_cooldown_4h',
  };
}

function createCard(): CreateFanCardElement {
  return document.createElement('create-fan-card') as CreateFanCardElement;
}

function mockBrowserModAvailability(available: boolean): void {
  const nativeGet = customElements.get.bind(customElements);

  vi.spyOn(customElements, 'get').mockImplementation((name: string) => {
    if (name === 'browser-mod') {
      return available ? class extends HTMLElement {} : undefined;
    }

    return nativeGet(name);
  });
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('create-fan-card', () => {
  it('registers the main custom element and card picker metadata', () => {
    expect(customElements.get('create-fan-card')).toBeDefined();
    expect(window.customCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'create-fan-card',
          name: 'Create Fan Card',
        }),
      ]),
    );
  });

  it('setConfig stores the Lovelace config', () => {
    const card = createCard();
    const config: CreateFanCardConfig = {
      type: 'custom:create-fan-card',
      entity: 'fan.test_fan',
    };

    card.setConfig(config);

    expect(card._config).toEqual(config);
  });

  it('setConfig throws when entity is missing', () => {
    const card = createCard();

    expect(() => {
      card.setConfig({ type: 'custom:create-fan-card', entity: '' });
    }).toThrowError('entity is required');
  });

  it('setting hass discovers all companion entities from the fan device', () => {
    const card = createCard();
    const hass = createMockHass();

    card.setConfig({
      type: 'custom:create-fan-card',
      entity: 'fan.test_fan',
    });
    card.hass = hass;

    expect(card._entities).toEqual(createExpectedEntities());
  });

  it('renders the compact card with the expected props', async () => {
    const card = createCard();
    const hass = createMockHass();

    card.setConfig({
      type: 'custom:create-fan-card',
      entity: 'fan.test_fan',
      name: 'Bedroom Fan',
    });
    card.hass = hass;
    document.body.appendChild(card);
    await card.updateComplete;

    const compactCard = card.shadowRoot?.querySelector(
      'create-fan-compact-card',
    ) as CompactCardElement | null;

    expect(compactCard).not.toBeNull();
    expect(compactCard?.hass).toBe(hass);
    expect(compactCard?.entityId).toBe('fan.test_fan');
    expect(compactCard?.name).toBe('Bedroom Fan');
    expect(compactCard?.entities).toEqual(createExpectedEntities());
  });

  it('returns a Lovelace card size of 3', () => {
    const card = createCard();

    expect(card.getCardSize()).toBe(3);
  });

  it('opens a Browser Mod popup when compact card dispatches open-remote', async () => {
    mockBrowserModAvailability(true);

    const card = createCard();
    const hass = createMockHass();
    const popupListener = vi.fn();
    const entities = createExpectedEntities();

    card.setConfig({
      type: 'custom:create-fan-card',
      entity: 'fan.test_fan',
      name: 'Bedroom Fan',
    });
    card.hass = hass;
    card.addEventListener('ll-custom', popupListener);
    document.body.appendChild(card);
    await card.updateComplete;

    const compactCard = card.shadowRoot?.querySelector('create-fan-compact-card');
    compactCard?.dispatchEvent(
      new CustomEvent('open-remote', {
        bubbles: true,
        composed: true,
        detail: {
          entityId: 'fan.test_fan',
          entities,
        },
      }),
    );

    expect(popupListener).toHaveBeenCalledTimes(1);
    const popupEvent = popupListener.mock.calls[0][0] as CustomEvent;
    expect(popupEvent.detail).toEqual({
      action: 'fire-dom-event',
      browser_mod: {
        action: 'popup',
        title: 'Bedroom Fan',
        adaptive: true,
        content: {
          type: 'custom:create-fan-remote-popup-card',
          entity: 'fan.test_fan',
          entities,
        },
      },
    });
  });

  it('falls back to hass-more-info when Browser Mod is unavailable', async () => {
    mockBrowserModAvailability(false);

    const card = createCard();
    const hass = createMockHass();
    const moreInfoListener = vi.fn();

    card.setConfig({
      type: 'custom:create-fan-card',
      entity: 'fan.test_fan',
    });
    card.hass = hass;
    card.addEventListener('hass-more-info', moreInfoListener);
    document.body.appendChild(card);
    await card.updateComplete;

    const compactCard = card.shadowRoot?.querySelector('create-fan-compact-card');
    compactCard?.dispatchEvent(
      new CustomEvent('open-remote', {
        bubbles: true,
        composed: true,
        detail: {
          entityId: 'fan.test_fan',
          entities: createExpectedEntities(),
        },
      }),
    );

    expect(moreInfoListener).toHaveBeenCalledTimes(1);
    const moreInfoEvent = moreInfoListener.mock.calls[0][0] as CustomEvent;
    expect(moreInfoEvent.detail).toEqual({ entityId: 'fan.test_fan' });
  });
});
