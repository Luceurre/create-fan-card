import type { HomeAssistant } from '../types/home-assistant';
import type { FanEntities } from './device-entities';
import { isEntityOn } from './device-entities';
import {
  callButtonPress,
  callFanSpeed,
  callFanToggle,
  callFanTurnOff,
  callFanTurnOn,
  callLightToggle,
  callSelectOption,
  callSwitchToggle,
} from './ha-service';

export function groupFanToggle(hass: HomeAssistant, fanEntitiesList: FanEntities[]): void {
  const allOn = fanEntitiesList.length > 0 && fanEntitiesList.every((fe) => isEntityOn(hass, fe.fan));
  for (const fe of fanEntitiesList) {
    if (allOn) {
      callFanTurnOff(hass, fe.fan);
    } else {
      callFanTurnOn(hass, fe.fan);
    }
  }
}

export function groupFanTurnOn(hass: HomeAssistant, fanEntitiesList: FanEntities[]): void {
  for (const fe of fanEntitiesList) {
    callFanTurnOn(hass, fe.fan);
  }
}

export function groupFanTurnOff(hass: HomeAssistant, fanEntitiesList: FanEntities[]): void {
  for (const fe of fanEntitiesList) {
    callFanTurnOff(hass, fe.fan);
  }
}

export function groupFanSpeed(hass: HomeAssistant, fanEntitiesList: FanEntities[], speed: string): void {
  for (const fe of fanEntitiesList) {
    callFanSpeed(hass, fe.fan, speed);
  }
}

export function groupLightToggle(hass: HomeAssistant, fanEntitiesList: FanEntities[]): void {
  for (const fe of fanEntitiesList) {
    if (fe.light) {
      callLightToggle(hass, fe.light);
    }
  }
}

export function groupColorSelect(hass: HomeAssistant, fanEntitiesList: FanEntities[], option: string): void {
  for (const fe of fanEntitiesList) {
    if (fe.color) {
      callSelectOption(hass, fe.color, option);
    }
  }
}

export function groupDirectionToggle(hass: HomeAssistant, fanEntitiesList: FanEntities[]): void {
  for (const fe of fanEntitiesList) {
    if (fe.direction) {
      callSwitchToggle(hass, fe.direction);
    }
  }
}

export function groupMuteToggle(hass: HomeAssistant, fanEntitiesList: FanEntities[]): void {
  for (const fe of fanEntitiesList) {
    if (fe.mute) {
      callSwitchToggle(hass, fe.mute);
    }
  }
}

export function groupTimerPress(hass: HomeAssistant, fanEntitiesList: FanEntities[]): void {
  for (const fe of fanEntitiesList) {
    const button = fe.cooldown1h ?? fe.cooldown2h ?? fe.cooldown4h;
    if (button) {
      callButtonPress(hass, button);
    }
  }
}
