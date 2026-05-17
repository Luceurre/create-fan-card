import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HomeAssistant } from '../../src/types/home-assistant';
import {
  callButtonPress,
  callFanSpeed,
  callFanToggle,
  callFanTurnOff,
  callFanTurnOn,
  callLightToggle,
  callSelectOption,
  callSwitchToggle,
} from '../../src/utils/ha-service';

describe('ha-service utils', () => {
  let callService: ReturnType<typeof vi.fn<HomeAssistant['callService']>>;
  let hass: HomeAssistant;

  beforeEach(() => {
    callService = vi.fn<HomeAssistant['callService']>();
    hass = {
      states: {},
      entities: {},
      callService,
      callWS: vi.fn<HomeAssistant['callWS']>(),
    };
  });

  it('calls the fan toggle service', () => {
    callFanToggle(hass, 'fan.living_room');

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith('fan', 'toggle', { entity_id: 'fan.living_room' });
  });

  it.each(['speed1', 'speed2', 'speed3', 'speed4', 'speed5', 'speed6'])(
    'calls the fan preset mode service for %s',
    (presetMode) => {
      callFanSpeed(hass, 'fan.living_room', presetMode);

      expect(callService).toHaveBeenCalledOnce();
      expect(callService).toHaveBeenCalledWith('fan', 'set_preset_mode', {
        entity_id: 'fan.living_room',
        preset_mode: presetMode,
      });
    },
  );

  it('calls the fan turn_on service', () => {
    callFanTurnOn(hass, 'fan.living_room');

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith('fan', 'turn_on', { entity_id: 'fan.living_room' });
  });

  it('calls the fan turn_off service', () => {
    callFanTurnOff(hass, 'fan.living_room');

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith('fan', 'turn_off', { entity_id: 'fan.living_room' });
  });

  it('calls the light toggle service', () => {
    callLightToggle(hass, 'light.kitchen');

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith('light', 'toggle', { entity_id: 'light.kitchen' });
  });

  it.each(['cold', 'white', 'warm'])('calls the select option service for %s', (option) => {
    callSelectOption(hass, 'select.fan_color', option);

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith('select', 'select_option', {
      entity_id: 'select.fan_color',
      option,
    });
  });

  it.each([
    ['switch.coffee_maker', 'switch'],
    ['input_boolean.guest_mode', 'input_boolean'],
  ])('calls the toggle service for %s using the %s domain', (entityId, domain) => {
    callSwitchToggle(hass, entityId);

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith(domain, 'toggle', { entity_id: entityId });
  });

  it('calls the button press service', () => {
    callButtonPress(hass, 'button.reset_filter');

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith('button', 'press', { entity_id: 'button.reset_filter' });
  });
});
