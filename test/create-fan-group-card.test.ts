import { afterEach, describe, expect, it, vi } from 'vitest';

import '../src/create-fan-group-card';

import type { HomeAssistant } from '../src/types/home-assistant';
import type { CreateFanGroupCardConfig } from '../src/create-fan-group-card';
import type { FanEntities } from '../src/utils/device-entities';

type CreateFanGroupCardElement = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(config: CreateFanGroupCardConfig): void;
  getCardSize(): number;
  updateComplete: Promise<void>;
  _config?: CreateFanGroupCardConfig;
  _fanEntitiesList?: FanEntities[];
};

type GroupCompactCardElement = HTMLElement & {
  hass?: HomeAssistant;
  name: string;
  fanEntitiesList: FanEntities[];
};

function createMockHass(): HomeAssistant {
  return {
    states: {
      'fan.test_fan_1': {
        state: 'on',
        attributes: {
          friendly_name: 'Bedroom Fan 1',
          preset_mode: 'speed3',
        },
        entity_id: 'fan.test_fan_1',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'light.test_fan_1_light': {
        state: 'off',
        attributes: { friendly_name: 'Fan 1 Light' },
        entity_id: 'light.test_fan_1_light',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'select.test_fan_1_color': {
        state: 'white',
        attributes: {},
        entity_id: 'select.test_fan_1_color',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'switch.test_fan_1_direction': {
        state: 'on',
        attributes: {},
        entity_id: 'switch.test_fan_1_direction',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'switch.test_fan_1_mute': {
        state: 'off',
        attributes: {},
        entity_id: 'switch.test_fan_1_mute',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'sensor.test_fan_1_timer': {
        state: JSON.stringify({ duration: 14400, remaining: 3600 }),
        attributes: {},
        entity_id: 'sensor.test_fan_1_timer',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'button.test_fan_1_cooldown_1h': {
        state: 'idle',
        attributes: {},
        entity_id: 'button.test_fan_1_cooldown_1h',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'button.test_fan_1_cooldown_2h': {
        state: 'idle',
        attributes: {},
        entity_id: 'button.test_fan_1_cooldown_2h',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'button.test_fan_1_cooldown_4h': {
        state: 'idle',
        attributes: {},
        entity_id: 'button.test_fan_1_cooldown_4h',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'fan.test_fan_2': {
        state: 'off',
        attributes: {
          friendly_name: 'Bedroom Fan 2',
          preset_mode: 'speed1',
        },
        entity_id: 'fan.test_fan_2',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'light.test_fan_2_light': {
        state: 'on',
        attributes: { friendly_name: 'Fan 2 Light' },
        entity_id: 'light.test_fan_2_light',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'select.test_fan_2_color': {
        state: 'warm',
        attributes: {},
        entity_id: 'select.test_fan_2_color',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'switch.test_fan_2_direction': {
        state: 'off',
        attributes: {},
        entity_id: 'switch.test_fan_2_direction',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'switch.test_fan_2_mute': {
        state: 'on',
        attributes: {},
        entity_id: 'switch.test_fan_2_mute',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'sensor.test_fan_2_timer': {
        state: JSON.stringify({ duration: 7200, remaining: 1800 }),
        attributes: {},
        entity_id: 'sensor.test_fan_2_timer',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'button.test_fan_2_cooldown_1h': {
        state: 'idle',
        attributes: {},
        entity_id: 'button.test_fan_2_cooldown_1h',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'button.test_fan_2_cooldown_2h': {
        state: 'idle',
        attributes: {},
        entity_id: 'button.test_fan_2_cooldown_2h',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
      'button.test_fan_2_cooldown_4h': {
        state: 'idle',
        attributes: {},
        entity_id: 'button.test_fan_2_cooldown_4h',
        last_changed: '2026-05-16T00:00:00Z',
        last_updated: '2026-05-16T00:00:00Z',
      },
    },
    entities: {
      'fan.test_fan_1': {
        entity_id: 'fan.test_fan_1',
        device_id: 'device-1',
        platform: 'demo',
      },
      'light.test_fan_1_light': {
        entity_id: 'light.test_fan_1_light',
        device_id: 'device-1',
        platform: 'demo',
      },
      'select.test_fan_1_color': {
        entity_id: 'select.test_fan_1_color',
        device_id: 'device-1',
        platform: 'demo',
      },
      'switch.test_fan_1_direction': {
        entity_id: 'switch.test_fan_1_direction',
        device_id: 'device-1',
        platform: 'demo',
      },
      'switch.test_fan_1_mute': {
        entity_id: 'switch.test_fan_1_mute',
        device_id: 'device-1',
        platform: 'demo',
      },
      'sensor.test_fan_1_timer': {
        entity_id: 'sensor.test_fan_1_timer',
        device_id: 'device-1',
        platform: 'demo',
      },
      'button.test_fan_1_cooldown_1h': {
        entity_id: 'button.test_fan_1_cooldown_1h',
        device_id: 'device-1',
        platform: 'demo',
      },
      'button.test_fan_1_cooldown_2h': {
        entity_id: 'button.test_fan_1_cooldown_2h',
        device_id: 'device-1',
        platform: 'demo',
      },
      'button.test_fan_1_cooldown_4h': {
        entity_id: 'button.test_fan_1_cooldown_4h',
        device_id: 'device-1',
        platform: 'demo',
      },
      'fan.test_fan_2': {
        entity_id: 'fan.test_fan_2',
        device_id: 'device-2',
        platform: 'demo',
      },
      'light.test_fan_2_light': {
        entity_id: 'light.test_fan_2_light',
        device_id: 'device-2',
        platform: 'demo',
      },
      'select.test_fan_2_color': {
        entity_id: 'select.test_fan_2_color',
        device_id: 'device-2',
        platform: 'demo',
      },
      'switch.test_fan_2_direction': {
        entity_id: 'switch.test_fan_2_direction',
        device_id: 'device-2',
        platform: 'demo',
      },
      'switch.test_fan_2_mute': {
        entity_id: 'switch.test_fan_2_mute',
        device_id: 'device-2',
        platform: 'demo',
      },
      'sensor.test_fan_2_timer': {
        entity_id: 'sensor.test_fan_2_timer',
        device_id: 'device-2',
        platform: 'demo',
      },
      'button.test_fan_2_cooldown_1h': {
        entity_id: 'button.test_fan_2_cooldown_1h',
        device_id: 'device-2',
        platform: 'demo',
      },
      'button.test_fan_2_cooldown_2h': {
        entity_id: 'button.test_fan_2_cooldown_2h',
        device_id: 'device-2',
        platform: 'demo',
      },
      'button.test_fan_2_cooldown_4h': {
        entity_id: 'button.test_fan_2_cooldown_4h',
        device_id: 'device-2',
        platform: 'demo',
      },
    },
    callService: vi.fn(),
    callWS: vi.fn().mockResolvedValue(null),
  };
}

function createExpectedEntities1(): FanEntities {
  return {
    fan: 'fan.test_fan_1',
    light: 'light.test_fan_1_light',
    color: 'select.test_fan_1_color',
    direction: 'switch.test_fan_1_direction',
    mute: 'switch.test_fan_1_mute',
    timer: 'sensor.test_fan_1_timer',
    cooldown1h: 'button.test_fan_1_cooldown_1h',
    cooldown2h: 'button.test_fan_1_cooldown_2h',
    cooldown4h: 'button.test_fan_1_cooldown_4h',
  };
}

function createExpectedEntities2(): FanEntities {
  return {
    fan: 'fan.test_fan_2',
    light: 'light.test_fan_2_light',
    color: 'select.test_fan_2_color',
    direction: 'switch.test_fan_2_direction',
    mute: 'switch.test_fan_2_mute',
    timer: 'sensor.test_fan_2_timer',
    cooldown1h: 'button.test_fan_2_cooldown_1h',
    cooldown2h: 'button.test_fan_2_cooldown_2h',
    cooldown4h: 'button.test_fan_2_cooldown_4h',
  };
}

function createCard(): CreateFanGroupCardElement {
  return document.createElement('create-fan-group-card') as CreateFanGroupCardElement;
}

function mockBrowserModAvailability(available: boolean): void {
  if (available) {
    (window as any).browser_mod = {};
  } else {
    delete (window as any).browser_mod;
  }
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  delete (window as any).browser_mod;
});

describe('create-fan-group-card', () => {
  it('registers the main custom element and card picker metadata', () => {
    expect(customElements.get('create-fan-group-card')).toBeDefined();
    expect(window.customCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'create-fan-group-card',
          name: 'Create Fan Group Card',
        }),
      ]),
    );
  });

  it('setConfig stores the Lovelace config', () => {
    const card = createCard();
    const config: CreateFanGroupCardConfig = {
      type: 'custom:create-fan-group-card',
      entities: ['fan.test_fan_1', 'fan.test_fan_2'],
    };

    card.setConfig(config);

    expect(card._config).toEqual(config);
  });

  it('setConfig throws when entities is missing', () => {
    const card = createCard();

    expect(() => {
      card.setConfig({ type: 'custom:create-fan-group-card' } as CreateFanGroupCardConfig);
    }).toThrowError('entities must be a non-empty array of fan entity IDs');
  });

  it('setConfig throws when entities is empty', () => {
    const card = createCard();

    expect(() => {
      card.setConfig({ type: 'custom:create-fan-group-card', entities: [] });
    }).toThrowError('entities must be a non-empty array of fan entity IDs');
  });

  it('setting hass discovers companion entities for ALL fans in the group', () => {
    const card = createCard();
    const hass = createMockHass();

    card.setConfig({
      type: 'custom:create-fan-group-card',
      entities: ['fan.test_fan_1', 'fan.test_fan_2'],
    });
    card.hass = hass;

    expect(card._fanEntitiesList).toEqual([
      createExpectedEntities1(),
      createExpectedEntities2(),
    ]);
  });

  it('renders the group compact card with the expected props', async () => {
    const card = createCard();
    const hass = createMockHass();

    card.setConfig({
      type: 'custom:create-fan-group-card',
      entities: ['fan.test_fan_1', 'fan.test_fan_2'],
      name: 'Bedroom Fans',
    });
    card.hass = hass;
    document.body.appendChild(card);
    await card.updateComplete;

    const compactCard = card.shadowRoot?.querySelector(
      'create-fan-group-compact-card',
    ) as GroupCompactCardElement | null;

    expect(compactCard).not.toBeNull();
    expect(compactCard?.hass).toBe(hass);
    expect(compactCard?.name).toBe('Bedroom Fans');
    expect(compactCard?.fanEntitiesList).toEqual([
      createExpectedEntities1(),
      createExpectedEntities2(),
    ]);
  });

  it('returns a Lovelace card size of 3', () => {
    const card = createCard();

    expect(card.getCardSize()).toBe(3);
  });

  it('opens a Browser Mod popup when group compact card dispatches open-remote', async () => {
    mockBrowserModAvailability(true);

    const card = createCard();
    const hass = createMockHass();
    const fanEntitiesList = [createExpectedEntities1(), createExpectedEntities2()];
    const bodySpy = vi.spyOn(document.body, 'dispatchEvent');

    card.setConfig({
      type: 'custom:create-fan-group-card',
      entities: ['fan.test_fan_1', 'fan.test_fan_2'],
      name: 'Bedroom Fans',
    });
    card.hass = hass;
    document.body.appendChild(card);
    await card.updateComplete;

    const compactCard = card.shadowRoot?.querySelector('create-fan-group-compact-card');
    compactCard?.dispatchEvent(
      new CustomEvent('open-remote', {
        bubbles: true,
        composed: true,
        detail: {
          fanEntitiesList,
        },
      }),
    );

    const llCustomCalls = bodySpy.mock.calls
      .map(call => call[0] as CustomEvent)
      .filter(e => e.type === 'll-custom');
    expect(llCustomCalls.length).toBe(1);
    expect(llCustomCalls[0].detail).toEqual({
      browser_mod: {
        service: 'browser_mod.popup',
        data: {
          title: 'Bedroom Fans',
          content: {
            type: 'custom:create-fan-group-remote-popup-card',
            entity: 'fan.test_fan_1',
            fanEntitiesList,
          },
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
      type: 'custom:create-fan-group-card',
      entities: ['fan.test_fan_1', 'fan.test_fan_2'],
    });
    card.hass = hass;
    card.addEventListener('hass-more-info', moreInfoListener);
    document.body.appendChild(card);
    await card.updateComplete;

    const compactCard = card.shadowRoot?.querySelector('create-fan-group-compact-card');
    compactCard?.dispatchEvent(
      new CustomEvent('open-remote', {
        bubbles: true,
        composed: true,
        detail: {
          fanEntitiesList: [createExpectedEntities1(), createExpectedEntities2()],
        },
      }),
    );

    expect(moreInfoListener).toHaveBeenCalledTimes(1);
    const moreInfoEvent = moreInfoListener.mock.calls[0][0] as CustomEvent;
    expect(moreInfoEvent.detail).toEqual({ entityId: 'fan.test_fan_1' });
  });
});
