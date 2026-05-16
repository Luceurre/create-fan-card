import { describe, expect, it } from 'vitest';
import { getGroupState } from '../../src/utils/group-state';
import type { FanEntities } from '../../src/utils/device-entities';
import type { HassEntity, HomeAssistant } from '../../src/types/home-assistant';

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

function createMockHass(states: Record<string, HassEntity> = {}): HomeAssistant {
  return {
    entities: {},
    states,
    callService(): void {},
    async callWS(): Promise<undefined> { return undefined; },
  };
}

describe('getGroupState', () => {
  it('returns all-off defaults for an empty fan list', () => {
    const hass = createMockHass();
    const result = getGroupState(hass, []);

    expect(result).toEqual({
      fanOn: false,
      speed: 0,
      speedPreset: '',
      speedLabel: 'Off',
      lightOn: false,
      hasLight: false,
      hasColor: false,
      directionClockwise: true,
      hasDirection: false,
      muteOn: false,
      hasMute: false,
      hasTimer: false,
      hasCooldowns: false,
      hasCooldown1h: false,
      hasCooldown2h: false,
      hasCooldown4h: false,
    });
  });

  it('returns fanOn true when all fans are on with a common speed', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a' },
      { fan: 'fan.b' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.fanOn).toBe(true);
    expect(result.speed).toBe(3);
    expect(result.speedLabel).toBe('Speed 3');
  });

  it('returns fanOn false when one fan is off', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'fan.b': createEntityState('fan.b', 'off'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a' },
      { fan: 'fan.b' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.fanOn).toBe(false);
  });

  it('returns speed 0 and label Mixed when fans have different speeds', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed5' }),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a' },
      { fan: 'fan.b' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.fanOn).toBe(true);
    expect(result.speed).toBe(0);
    expect(result.speedLabel).toBe('Mixed');
  });

  it('returns lightOn true when all fans with lights are on', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'light.a_light': createEntityState('light.a_light', 'on'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'light.b_light': createEntityState('light.b_light', 'on'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', light: 'light.a_light' },
      { fan: 'fan.b', light: 'light.b_light' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.lightOn).toBe(true);
  });

  it('returns lightOn false when one light is off', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'light.a_light': createEntityState('light.a_light', 'on'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'light.b_light': createEntityState('light.b_light', 'off'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', light: 'light.a_light' },
      { fan: 'fan.b', light: 'light.b_light' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.lightOn).toBe(false);
  });

  it('returns lightOn false when no fans have light entities', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.lightOn).toBe(false);
  });

  it('returns common color when all fans agree', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'select.a_color': createEntityState('select.a_color', 'white'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'select.b_color': createEntityState('select.b_color', 'white'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', color: 'select.a_color' },
      { fan: 'fan.b', color: 'select.b_color' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.color).toBe('white');
  });

  it('returns color undefined when fans have different colors', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'select.a_color': createEntityState('select.a_color', 'white'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'select.b_color': createEntityState('select.b_color', 'yellow'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', color: 'select.a_color' },
      { fan: 'fan.b', color: 'select.b_color' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.color).toBeUndefined();
  });

  it('returns directionClockwise true when all direction switches are on', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'switch.a_dir': createEntityState('switch.a_dir', 'on'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'switch.b_dir': createEntityState('switch.b_dir', 'on'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', direction: 'switch.a_dir' },
      { fan: 'fan.b', direction: 'switch.b_dir' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.directionClockwise).toBe(true);
  });

  it('defaults directionClockwise to true when directions are mixed', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'switch.a_dir': createEntityState('switch.a_dir', 'on'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'switch.b_dir': createEntityState('switch.b_dir', 'off'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', direction: 'switch.a_dir' },
      { fan: 'fan.b', direction: 'switch.b_dir' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.directionClockwise).toBe(true);
  });

  it('returns muteOn true when all mute switches are on', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'switch.a_mute': createEntityState('switch.a_mute', 'on'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'switch.b_mute': createEntityState('switch.b_mute', 'on'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', mute: 'switch.a_mute' },
      { fan: 'fan.b', mute: 'switch.b_mute' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.muteOn).toBe(true);
  });

  it('returns muteOn false when one mute is off', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'switch.a_mute': createEntityState('switch.a_mute', 'on'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'switch.b_mute': createEntityState('switch.b_mute', 'off'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', mute: 'switch.a_mute' },
      { fan: 'fan.b', mute: 'switch.b_mute' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.muteOn).toBe(false);
  });

  it('returns timerData from the first fan that has timer data', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'sensor.a_timer': createEntityState('sensor.a_timer', '{"duration":120,"remaining":45}'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'sensor.b_timer': createEntityState('sensor.b_timer', '{"duration":60,"remaining":10}'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', timer: 'sensor.a_timer' },
      { fan: 'fan.b', timer: 'sensor.b_timer' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.timerData).toEqual({ duration: 120, remaining: 45 });
  });

  it('skips fans without timer data and returns from first valid one', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
      'sensor.a_timer': createEntityState('sensor.a_timer', 'not-json'),
      'fan.b': createEntityState('fan.b', 'on', { preset_mode: 'speed3' }),
      'sensor.b_timer': createEntityState('sensor.b_timer', '{"duration":60,"remaining":10}'),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a', timer: 'sensor.a_timer' },
      { fan: 'fan.b', timer: 'sensor.b_timer' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.timerData).toEqual({ duration: 60, remaining: 10 });
  });

  it('returns undefined timerData when no fans have timer data', () => {
    const hass = createMockHass({
      'fan.a': createEntityState('fan.a', 'on', { preset_mode: 'speed3' }),
    });

    const fans: FanEntities[] = [
      { fan: 'fan.a' },
    ];

    const result = getGroupState(hass, fans);

    expect(result.timerData).toBeUndefined();
  });
});
