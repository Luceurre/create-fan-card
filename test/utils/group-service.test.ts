import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FanEntities } from '../../src/utils/device-entities';
import type { HomeAssistant } from '../../src/types/home-assistant';
import {
  groupColorSelect,
  groupDirectionToggle,
  groupFanSpeed,
  groupFanToggle,
  groupFanTurnOff,
  groupFanTurnOn,
  groupLightToggle,
  groupMuteToggle,
  groupTimerPress,
} from '../../src/utils/group-service';

function createMockHass(states: Record<string, { state: string; attributes?: Record<string, unknown> }> = {}): HomeAssistant {
  return {
    entities: {},
    states: Object.fromEntries(
      Object.entries(states).map(([id, s]) => [id, {
        entity_id: id,
        state: s.state,
        attributes: s.attributes ?? {},
        last_changed: '2026-05-16T00:00:00.000Z',
        last_updated: '2026-05-16T00:00:00.000Z',
      }]),
    ),
    callService: vi.fn<HomeAssistant['callService']>(),
    callWS: vi.fn<HomeAssistant['callWS']>(),
  };
}

describe('group-service', () => {
  let hass: HomeAssistant;
  let callService: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    hass = createMockHass({
      'fan.a': { state: 'on', attributes: { preset_mode: 'speed3' } },
      'fan.b': { state: 'on', attributes: { preset_mode: 'speed3' } },
    });
    callService = hass.callService as ReturnType<typeof vi.fn>;
  });

  describe('groupFanToggle', () => {
    it('turns all fans off when all are on', () => {
      const fans: FanEntities[] = [{ fan: 'fan.a' }, { fan: 'fan.b' }];

      groupFanToggle(hass, fans);

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('fan', 'turn_off', { entity_id: 'fan.a' });
      expect(callService).toHaveBeenCalledWith('fan', 'turn_off', { entity_id: 'fan.b' });
    });

    it('turns all fans on when any is off', () => {
      hass.states['fan.b'] = {
        entity_id: 'fan.b',
        state: 'off',
        attributes: {},
        last_changed: '2026-05-16T00:00:00.000Z',
        last_updated: '2026-05-16T00:00:00.000Z',
      };

      const fans: FanEntities[] = [{ fan: 'fan.a' }, { fan: 'fan.b' }];

      groupFanToggle(hass, fans);

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('fan', 'turn_on', { entity_id: 'fan.a' });
      expect(callService).toHaveBeenCalledWith('fan', 'turn_on', { entity_id: 'fan.b' });
    });
  });

  describe('groupFanTurnOn', () => {
    it('calls turn_on for each fan entity', () => {
      const fans: FanEntities[] = [{ fan: 'fan.a' }, { fan: 'fan.b' }];

      groupFanTurnOn(hass, fans);

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('fan', 'turn_on', { entity_id: 'fan.a' });
      expect(callService).toHaveBeenCalledWith('fan', 'turn_on', { entity_id: 'fan.b' });
    });
  });

  describe('groupFanTurnOff', () => {
    it('calls turn_off for each fan entity', () => {
      const fans: FanEntities[] = [{ fan: 'fan.a' }, { fan: 'fan.b' }];

      groupFanTurnOff(hass, fans);

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('fan', 'turn_off', { entity_id: 'fan.a' });
      expect(callService).toHaveBeenCalledWith('fan', 'turn_off', { entity_id: 'fan.b' });
    });
  });

  describe('groupFanSpeed', () => {
    it('calls set_preset_mode for each fan entity', () => {
      const fans: FanEntities[] = [{ fan: 'fan.a' }, { fan: 'fan.b' }];

      groupFanSpeed(hass, fans, 'speed5');

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('fan', 'set_preset_mode', { entity_id: 'fan.a', preset_mode: 'speed5' });
      expect(callService).toHaveBeenCalledWith('fan', 'set_preset_mode', { entity_id: 'fan.b', preset_mode: 'speed5' });
    });
  });

  describe('groupLightToggle', () => {
    it('toggles all light entities', () => {
      const fans: FanEntities[] = [
        { fan: 'fan.a', light: 'light.a_light' },
        { fan: 'fan.b', light: 'light.b_light' },
      ];

      groupLightToggle(hass, fans);

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('light', 'toggle', { entity_id: 'light.a_light' });
      expect(callService).toHaveBeenCalledWith('light', 'toggle', { entity_id: 'light.b_light' });
    });

    it('skips fans without a light entity', () => {
      const fans: FanEntities[] = [
        { fan: 'fan.a', light: 'light.a_light' },
        { fan: 'fan.b' },
      ];

      groupLightToggle(hass, fans);

      expect(callService).toHaveBeenCalledOnce();
      expect(callService).toHaveBeenCalledWith('light', 'toggle', { entity_id: 'light.a_light' });
    });
  });

  describe('groupColorSelect', () => {
    it('selects the option on all color entities', () => {
      const fans: FanEntities[] = [
        { fan: 'fan.a', color: 'select.a_color' },
        { fan: 'fan.b', color: 'select.b_color' },
      ];

      groupColorSelect(hass, fans, 'warm');

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('select', 'select_option', { entity_id: 'select.a_color', option: 'warm' });
      expect(callService).toHaveBeenCalledWith('select', 'select_option', { entity_id: 'select.b_color', option: 'warm' });
    });
  });

  describe('groupDirectionToggle', () => {
    it('toggles all direction entities', () => {
      const fans: FanEntities[] = [
        { fan: 'fan.a', direction: 'switch.a_dir' },
        { fan: 'fan.b', direction: 'switch.b_dir' },
      ];

      groupDirectionToggle(hass, fans);

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('switch', 'toggle', { entity_id: 'switch.a_dir' });
      expect(callService).toHaveBeenCalledWith('switch', 'toggle', { entity_id: 'switch.b_dir' });
    });
  });

  describe('groupMuteToggle', () => {
    it('toggles all mute entities', () => {
      const fans: FanEntities[] = [
        { fan: 'fan.a', mute: 'switch.a_mute' },
        { fan: 'fan.b', mute: 'switch.b_mute' },
      ];

      groupMuteToggle(hass, fans);

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('switch', 'toggle', { entity_id: 'switch.a_mute' });
      expect(callService).toHaveBeenCalledWith('switch', 'toggle', { entity_id: 'switch.b_mute' });
    });
  });

  describe('groupTimerPress', () => {
    it('presses the first available cooldown button for each fan (prefers 1h)', () => {
      const fans: FanEntities[] = [
        { fan: 'fan.a', cooldown1h: 'button.a_cd1', cooldown2h: 'button.a_cd2', cooldown4h: 'button.a_cd4' },
        { fan: 'fan.b', cooldown1h: 'button.b_cd1', cooldown4h: 'button.b_cd4' },
      ];

      groupTimerPress(hass, fans);

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('button', 'press', { entity_id: 'button.a_cd1' });
      expect(callService).toHaveBeenCalledWith('button', 'press', { entity_id: 'button.b_cd1' });
    });

    it('falls back to 2h then 4h when 1h is not available', () => {
      const fans: FanEntities[] = [
        { fan: 'fan.a', cooldown2h: 'button.a_cd2' },
        { fan: 'fan.b', cooldown4h: 'button.b_cd4' },
      ];

      groupTimerPress(hass, fans);

      expect(callService).toHaveBeenCalledTimes(2);
      expect(callService).toHaveBeenCalledWith('button', 'press', { entity_id: 'button.a_cd2' });
      expect(callService).toHaveBeenCalledWith('button', 'press', { entity_id: 'button.b_cd4' });
    });

    it('skips fans without any cooldown buttons', () => {
      const fans: FanEntities[] = [
        { fan: 'fan.a', cooldown1h: 'button.a_cd1' },
        { fan: 'fan.b' },
      ];

      groupTimerPress(hass, fans);

      expect(callService).toHaveBeenCalledOnce();
      expect(callService).toHaveBeenCalledWith('button', 'press', { entity_id: 'button.a_cd1' });
    });
  });
});
