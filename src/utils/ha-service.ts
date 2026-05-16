import type { HomeAssistant } from '../types/home-assistant';

export function callFanToggle(hass: HomeAssistant, entityId: string): void {
  hass.callService('fan', 'toggle', { entity_id: entityId });
}

export function callFanSpeed(hass: HomeAssistant, entityId: string, presetMode: string): void {
  hass.callService('fan', 'set_preset_mode', { entity_id: entityId, preset_mode: presetMode });
}

export function callFanTurnOn(hass: HomeAssistant, entityId: string): void {
  hass.callService('fan', 'turn_on', { entity_id: entityId });
}

export function callFanTurnOff(hass: HomeAssistant, entityId: string): void {
  hass.callService('fan', 'turn_off', { entity_id: entityId });
}

export function callLightToggle(hass: HomeAssistant, entityId: string): void {
  hass.callService('light', 'toggle', { entity_id: entityId });
}

export function callSelectOption(hass: HomeAssistant, entityId: string, option: string): void {
  hass.callService('select', 'select_option', { entity_id: entityId, option });
}

export function callSwitchToggle(hass: HomeAssistant, entityId: string): void {
  const domain = entityId.split('.')[0];
  hass.callService(domain, 'toggle', { entity_id: entityId });
}

export function callButtonPress(hass: HomeAssistant, entityId: string): void {
  hass.callService('button', 'press', { entity_id: entityId });
}
