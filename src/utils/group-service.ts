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

/** Default delay (ms) between group commands to avoid overrunning the ESPSomfy TX queue. */
const GROUP_COMMAND_DELAY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run an async action for each fan in the list, spaced by GROUP_COMMAND_DELAY_MS.
 * The action is only called for fans where the optional entity exists.
 */
async function staggered<T>(
  fanEntitiesList: FanEntities[],
  action: (fe: FanEntities) => void,
  getEntity?: (fe: FanEntities) => T | undefined,
): Promise<void> {
  let first = true;
  for (const fe of fanEntitiesList) {
    if (getEntity && !getEntity(fe)) continue;
    if (!first) await delay(GROUP_COMMAND_DELAY_MS);
    first = false;
    action(fe);
  }
}

export async function groupFanToggle(hass: HomeAssistant, fanEntitiesList: FanEntities[]): Promise<void> {
  const allOn = fanEntitiesList.length > 0 && fanEntitiesList.every((fe) => isEntityOn(hass, fe.fan));
  await staggered(fanEntitiesList, (fe) => {
    if (allOn) callFanTurnOff(hass, fe.fan);
    else callFanTurnOn(hass, fe.fan);
  });
}

export async function groupFanTurnOn(hass: HomeAssistant, fanEntitiesList: FanEntities[]): Promise<void> {
  await staggered(fanEntitiesList, (fe) => callFanTurnOn(hass, fe.fan));
}

export async function groupFanTurnOff(hass: HomeAssistant, fanEntitiesList: FanEntities[]): Promise<void> {
  await staggered(fanEntitiesList, (fe) => callFanTurnOff(hass, fe.fan));
}

export async function groupFanSpeed(hass: HomeAssistant, fanEntitiesList: FanEntities[], speed: string): Promise<void> {
  await staggered(fanEntitiesList, (fe) => callFanSpeed(hass, fe.fan, speed));
}

export async function groupLightToggle(hass: HomeAssistant, fanEntitiesList: FanEntities[]): Promise<void> {
  await staggered(fanEntitiesList, (fe) => { if (fe.light) callLightToggle(hass, fe.light); });
}

export async function groupColorSelect(hass: HomeAssistant, fanEntitiesList: FanEntities[], option: string): Promise<void> {
  await staggered(fanEntitiesList, (fe) => { if (fe.color) callSelectOption(hass, fe.color, option); });
}

export async function groupDirectionToggle(hass: HomeAssistant, fanEntitiesList: FanEntities[]): Promise<void> {
  await staggered(fanEntitiesList, (fe) => { if (fe.direction) callSwitchToggle(hass, fe.direction); });
}

export async function groupMuteToggle(hass: HomeAssistant, fanEntitiesList: FanEntities[]): Promise<void> {
  await staggered(fanEntitiesList, (fe) => { if (fe.mute) callSwitchToggle(hass, fe.mute); });
}

export async function groupTimerPress(hass: HomeAssistant, fanEntitiesList: FanEntities[]): Promise<void> {
  await staggered(fanEntitiesList, (fe) => {
    const button = fe.cooldown1h ?? fe.cooldown2h ?? fe.cooldown4h;
    if (button) callButtonPress(hass, button);
  });
}
