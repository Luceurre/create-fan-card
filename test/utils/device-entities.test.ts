import { describe, expect, it } from 'vitest';
import {
  discoverFanEntities,
  getEntityState,
  getFanSpeed,
  getTimerInfo,
  isEntityOn,
} from '../../src/utils/device-entities';
import type {
  EntityRegistryEntry,
  HassEntity,
  HomeAssistant,
} from '../../src/types/home-assistant';

function createEntityState(
  entityId: string,
  state: string,
  attributes: Record<string, unknown> = {},
): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: '2026-05-16T00:00:00.000Z',
    last_updated: '2026-05-16T00:00:00.000Z',
  };
}

function createMockHass(): HomeAssistant {
  const entities: Record<string, EntityRegistryEntry> = {
    'fan.living_room': { entity_id: 'fan.living_room', device_id: 'dev1', platform: 'demo' },
    'light.living_room_light': {
      entity_id: 'light.living_room_light',
      device_id: 'dev1',
      platform: 'demo',
    },
    'select.living_room_color': {
      entity_id: 'select.living_room_color',
      device_id: 'dev1',
      platform: 'demo',
    },
    'switch.living_room_direction': {
      entity_id: 'switch.living_room_direction',
      device_id: 'dev1',
      platform: 'demo',
    },
    'switch.living_room_mute': {
      entity_id: 'switch.living_room_mute',
      device_id: 'dev1',
      platform: 'demo',
    },
    'sensor.living_room_timer': {
      entity_id: 'sensor.living_room_timer',
      device_id: 'dev1',
      platform: 'demo',
    },
    'button.living_room_cooldown_1h': {
      entity_id: 'button.living_room_cooldown_1h',
      device_id: 'dev1',
      platform: 'demo',
    },
    'button.living_room_cooldown_2h': {
      entity_id: 'button.living_room_cooldown_2h',
      device_id: 'dev1',
      platform: 'demo',
    },
    'button.living_room_cooldown_4h': {
      entity_id: 'button.living_room_cooldown_4h',
      device_id: 'dev1',
      platform: 'demo',
    },
    'climate.other_device': {
      entity_id: 'climate.other_device',
      device_id: 'dev2',
      platform: 'demo',
    },
  };

  const states: Record<string, HassEntity> = {
    'fan.living_room': createEntityState('fan.living_room', 'on', { preset_mode: 'breeze' }),
    'light.living_room_light': createEntityState('light.living_room_light', 'on'),
    'select.living_room_color': createEntityState('select.living_room_color', 'white'),
    'switch.living_room_direction': createEntityState('switch.living_room_direction', 'ON'),
    'switch.living_room_mute': createEntityState('switch.living_room_mute', 'off'),
    'sensor.living_room_timer': createEntityState(
      'sensor.living_room_timer',
      '{"duration":14400,"remaining":3600}',
    ),
    'button.living_room_cooldown_1h': createEntityState('button.living_room_cooldown_1h', 'idle'),
    'button.living_room_cooldown_2h': createEntityState('button.living_room_cooldown_2h', 'idle'),
    'button.living_room_cooldown_4h': createEntityState('button.living_room_cooldown_4h', 'idle'),
    'climate.other_device': createEntityState('climate.other_device', 'off'),
  };

  return {
    entities,
    states,
    callService(): void {
    },
    async callWS(): Promise<undefined> {
      return undefined;
    },
  };
}

describe('device entity discovery utils', () => {
  it('discovers all sibling fan entities on the same device', () => {
    const hass = createMockHass();

    expect(discoverFanEntities(hass, 'fan.living_room')).toEqual({
      fan: 'fan.living_room',
      light: 'light.living_room_light',
      color: 'select.living_room_color',
      direction: 'switch.living_room_direction',
      mute: 'switch.living_room_mute',
      timer: 'sensor.living_room_timer',
      cooldown1h: 'button.living_room_cooldown_1h',
      cooldown2h: 'button.living_room_cooldown_2h',
      cooldown4h: 'button.living_room_cooldown_4h',
    });
  });

  it('returns only the fan when the fan entity has no device id', () => {
    const hass = createMockHass();
    hass.entities['fan.living_room'] = {
      entity_id: 'fan.living_room',
      platform: 'demo',
    };

    expect(discoverFanEntities(hass, 'fan.living_room')).toEqual({
      fan: 'fan.living_room',
    });
  });

  it('returns the current state string for an entity', () => {
    const hass = createMockHass();

    expect(getEntityState(hass, 'select.living_room_color')).toBe('white');
    expect(getEntityState(hass, 'sensor.missing')).toBeUndefined();
  });

  it('treats both on and ON as enabled states', () => {
    const hass = createMockHass();

    expect(isEntityOn(hass, 'light.living_room_light')).toBe(true);
    expect(isEntityOn(hass, 'switch.living_room_direction')).toBe(true);
    expect(isEntityOn(hass, 'switch.living_room_mute')).toBe(false);
    expect(isEntityOn(hass, 'switch.unknown')).toBe(false);
  });

  it('reads the fan preset mode as speed', () => {
    const hass = createMockHass();

    expect(getFanSpeed(hass, 'fan.living_room')).toBe('breeze');
    expect(getFanSpeed(hass, 'fan.unknown')).toBeUndefined();
  });

  it('parses timer JSON state into duration and remaining values', () => {
    const hass = createMockHass();

    expect(getTimerInfo(hass, 'sensor.living_room_timer')).toEqual({
      duration: 14400,
      remaining: 3600,
    });
  });

  it('returns undefined for missing or invalid timer data', () => {
    const hass = createMockHass();
    hass.states['sensor.living_room_timer'] = createEntityState('sensor.living_room_timer', 'not-json');

    expect(getTimerInfo(hass, 'sensor.living_room_timer')).toBeUndefined();
    expect(getTimerInfo(hass, 'sensor.unknown')).toBeUndefined();
  });
});
