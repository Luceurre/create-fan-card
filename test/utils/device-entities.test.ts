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
    'fan.espsomfyrts_fan_3': { entity_id: 'fan.espsomfyrts_fan_3', device_id: 'dev1', platform: 'mqtt' },
    'light.espsomfyrts_fan_3_light': { entity_id: 'light.espsomfyrts_fan_3_light', device_id: 'dev1', platform: 'mqtt' },
    'select.espsomfyrts_fan_3_color': { entity_id: 'select.espsomfyrts_fan_3_color', device_id: 'dev1', platform: 'mqtt' },
    'switch.espsomfyrts_fan_3_direction': { entity_id: 'switch.espsomfyrts_fan_3_direction', device_id: 'dev1', platform: 'mqtt' },
    'switch.espsomfyrts_fan_3_mute': { entity_id: 'switch.espsomfyrts_fan_3_mute', device_id: 'dev1', platform: 'mqtt' },
    'sensor.espsomfyrts_fan_3_timer': { entity_id: 'sensor.espsomfyrts_fan_3_timer', device_id: 'dev1', platform: 'mqtt' },
    'button.espsomfyrts_fan_3_cooldown_1h': { entity_id: 'button.espsomfyrts_fan_3_cooldown_1h', device_id: 'dev1', platform: 'mqtt' },
    'button.espsomfyrts_fan_3_cooldown_2h': { entity_id: 'button.espsomfyrts_fan_3_cooldown_2h', device_id: 'dev1', platform: 'mqtt' },
    'button.espsomfyrts_fan_3_cooldown_4h': { entity_id: 'button.espsomfyrts_fan_3_cooldown_4h', device_id: 'dev1', platform: 'mqtt' },
    'fan.espsomfyrts_fan_5': { entity_id: 'fan.espsomfyrts_fan_5', device_id: 'dev1', platform: 'mqtt' },
    'light.espsomfyrts_fan_5_light': { entity_id: 'light.espsomfyrts_fan_5_light', device_id: 'dev1', platform: 'mqtt' },
    'climate.other_device': { entity_id: 'climate.other_device', device_id: 'dev2', platform: 'demo' },
  };

  const states: Record<string, HassEntity> = {
    'fan.espsomfyrts_fan_3': createEntityState('fan.espsomfyrts_fan_3', 'on', { preset_mode: 'speed3' }),
    'light.espsomfyrts_fan_3_light': createEntityState('light.espsomfyrts_fan_3_light', 'on'),
    'select.espsomfyrts_fan_3_color': createEntityState('select.espsomfyrts_fan_3_color', 'white'),
    'switch.espsomfyrts_fan_3_direction': createEntityState('switch.espsomfyrts_fan_3_direction', 'ON'),
    'switch.espsomfyrts_fan_3_mute': createEntityState('switch.espsomfyrts_fan_3_mute', 'off'),
    'sensor.espsomfyrts_fan_3_timer': createEntityState('sensor.espsomfyrts_fan_3_timer', '{"duration":120,"remaining":45}'),
    'button.espsomfyrts_fan_3_cooldown_1h': createEntityState('button.espsomfyrts_fan_3_cooldown_1h', 'idle'),
    'button.espsomfyrts_fan_3_cooldown_2h': createEntityState('button.espsomfyrts_fan_3_cooldown_2h', 'idle'),
    'button.espsomfyrts_fan_3_cooldown_4h': createEntityState('button.espsomfyrts_fan_3_cooldown_4h', 'idle'),
    'fan.espsomfyrts_fan_5': createEntityState('fan.espsomfyrts_fan_5', 'off'),
    'light.espsomfyrts_fan_5_light': createEntityState('light.espsomfyrts_fan_5_light', 'off'),
    'climate.other_device': createEntityState('climate.other_device', 'off'),
  };

  return {
    entities,
    states,
    callService(): void {},
    async callWS(): Promise<undefined> { return undefined; },
  };
}

describe('device entity discovery utils', () => {
  it('discovers all companion entities for fan 3 using entity ID pattern', () => {
    const hass = createMockHass();

    expect(discoverFanEntities(hass, 'fan.espsomfyrts_fan_3')).toEqual({
      fan: 'fan.espsomfyrts_fan_3',
      light: 'light.espsomfyrts_fan_3_light',
      color: 'select.espsomfyrts_fan_3_color',
      direction: 'switch.espsomfyrts_fan_3_direction',
      mute: 'switch.espsomfyrts_fan_3_mute',
      timer: 'sensor.espsomfyrts_fan_3_timer',
      cooldown1h: 'button.espsomfyrts_fan_3_cooldown_1h',
      cooldown2h: 'button.espsomfyrts_fan_3_cooldown_2h',
      cooldown4h: 'button.espsomfyrts_fan_3_cooldown_4h',
    });
  });

  it('does NOT match fan 5 entities when discovering fan 3', () => {
    const hass = createMockHass();
    const result = discoverFanEntities(hass, 'fan.espsomfyrts_fan_3');

    expect(result.light).toBe('light.espsomfyrts_fan_3_light');
    expect(result.light).not.toBe('light.espsomfyrts_fan_5_light');
  });

  it('discovers fan 5 entities correctly without cross-contamination', () => {
    const hass = createMockHass();
    const result = discoverFanEntities(hass, 'fan.espsomfyrts_fan_5');

    expect(result.fan).toBe('fan.espsomfyrts_fan_5');
    expect(result.light).toBe('light.espsomfyrts_fan_5_light');
    expect(result.color).toBeUndefined();
  });

  it('returns only the fan when no companion entities exist', () => {
    const hass = createMockHass();

    expect(discoverFanEntities(hass, 'climate.other_device')).toEqual({
      fan: 'climate.other_device',
    });
  });

  it('returns the current state string for an entity', () => {
    const hass = createMockHass();

    expect(getEntityState(hass, 'select.espsomfyrts_fan_3_color')).toBe('white');
    expect(getEntityState(hass, 'sensor.missing')).toBeUndefined();
  });

  it('treats both on and ON as enabled states', () => {
    const hass = createMockHass();

    expect(isEntityOn(hass, 'light.espsomfyrts_fan_3_light')).toBe(true);
    expect(isEntityOn(hass, 'switch.espsomfyrts_fan_3_direction')).toBe(true);
    expect(isEntityOn(hass, 'switch.espsomfyrts_fan_3_mute')).toBe(false);
    expect(isEntityOn(hass, 'switch.unknown')).toBe(false);
  });

  it('reads the fan preset mode as speed', () => {
    const hass = createMockHass();

    expect(getFanSpeed(hass, 'fan.espsomfyrts_fan_3')).toBe('speed3');
    expect(getFanSpeed(hass, 'fan.unknown')).toBeUndefined();
  });

  it('parses timer JSON state into duration and remaining values', () => {
    const hass = createMockHass();

    expect(getTimerInfo(hass, 'sensor.espsomfyrts_fan_3_timer')).toEqual({
      duration: 120,
      remaining: 45,
    });
  });

  it('returns undefined for missing or invalid timer data', () => {
    const hass = createMockHass();
    hass.states['sensor.espsomfyrts_fan_3_timer'] = createEntityState('sensor.espsomfyrts_fan_3_timer', 'not-json');

    expect(getTimerInfo(hass, 'sensor.espsomfyrts_fan_3_timer')).toBeUndefined();
    expect(getTimerInfo(hass, 'sensor.unknown')).toBeUndefined();
  });
});
