import type { HomeAssistant } from '../types/home-assistant';
import type { FanEntities } from './device-entities';
import { getEntityState, getFanSpeed, getTimerInfo, isEntityOn } from './device-entities';

export interface GroupFanState {
  fanOn: boolean;
  speed: number;
  speedPreset: string;
  speedLabel: string;
  lightOn: boolean;
  hasLight: boolean;
  color?: string;
  hasColor: boolean;
  directionClockwise: boolean;
  hasDirection: boolean;
  muteOn: boolean;
  hasMute: boolean;
  timerData?: { duration: number; remaining: number };
  hasTimer: boolean;
  hasCooldowns: boolean;
  hasCooldown1h: boolean;
  hasCooldown2h: boolean;
  hasCooldown4h: boolean;
}

function parseSpeedNumber(speedStr: string | undefined): number {
  if (!speedStr) return 0;
  const match = speedStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function getGroupState(hass: HomeAssistant, fanEntitiesList: FanEntities[]): GroupFanState {
  const empty: GroupFanState = {
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
  };

  if (fanEntitiesList.length === 0) return empty;

  const fanOn = fanEntitiesList.every((fe) => isEntityOn(hass, fe.fan));

  const speeds = fanEntitiesList.map((fe) => getFanSpeed(hass, fe.fan));
  const speedNumbers = speeds.map(parseSpeedNumber);
  const allSameSpeed = speedNumbers.length > 0 && speedNumbers.every((s) => s === speedNumbers[0]);
  const speed = fanOn && allSameSpeed ? speedNumbers[0] : 0;
  const speedPreset = fanOn && allSameSpeed ? (speeds[0] ?? '') : '';
  const speedLabel = !fanOn ? 'Off' : allSameSpeed ? `Speed ${speed}` : 'Mixed';

  const fansWithLights = fanEntitiesList.filter((fe) => fe.light != null);
  const hasLight = fansWithLights.length > 0;
  const lightOn = hasLight && fansWithLights.every((fe) => isEntityOn(hass, fe.light!));

  const fansWithColor = fanEntitiesList.filter((fe) => fe.color != null);
  const hasColor = fansWithColor.length > 0;
  let color: string | undefined;
  if (hasColor) {
    const colors = fansWithColor.map((fe) => getEntityState(hass, fe.color!));
    const allSameColor = colors.length > 0 && colors.every((c) => c === colors[0]);
    color = allSameColor ? colors[0] : undefined;
  }

  const fansWithDirection = fanEntitiesList.filter((fe) => fe.direction != null);
  const hasDirection = fansWithDirection.length > 0;
  let directionClockwise = true;
  if (hasDirection) {
    const directionStates = fansWithDirection.map((fe) => isEntityOn(hass, fe.direction!));
    const allSame = directionStates.every((d) => d === directionStates[0]);
    directionClockwise = allSame ? directionStates[0] : true;
  }

  const fansWithMute = fanEntitiesList.filter((fe) => fe.mute != null);
  const hasMute = fansWithMute.length > 0;
  const muteOn = hasMute && fansWithMute.every((fe) => isEntityOn(hass, fe.mute!));

  let timerData: { duration: number; remaining: number } | undefined;
  for (const fe of fanEntitiesList) {
    if (fe.timer) {
      const info = getTimerInfo(hass, fe.timer);
      if (info) {
        timerData = info;
        break;
      }
    }
  }

  const hasTimer = fanEntitiesList.some((fe) => fe.timer != null);
  const hasCooldown1h = fanEntitiesList.some((fe) => fe.cooldown1h != null);
  const hasCooldown2h = fanEntitiesList.some((fe) => fe.cooldown2h != null);
  const hasCooldown4h = fanEntitiesList.some((fe) => fe.cooldown4h != null);
  const hasCooldowns = hasCooldown1h || hasCooldown2h || hasCooldown4h;

  return {
    fanOn,
    speed,
    speedPreset,
    speedLabel,
    lightOn,
    hasLight,
    color,
    hasColor,
    directionClockwise,
    hasDirection,
    muteOn,
    hasMute,
    timerData,
    hasTimer,
    hasCooldowns,
    hasCooldown1h,
    hasCooldown2h,
    hasCooldown4h,
  };
}
