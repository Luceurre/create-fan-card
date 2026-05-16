import type { HomeAssistant, EntityRegistryEntry } from '../types/home-assistant';

export interface FanEntities {
  fan: string;
  light?: string;
  color?: string;
  direction?: string;
  mute?: string;
  timer?: string;
  cooldown1h?: string;
  cooldown2h?: string;
  cooldown4h?: string;
}

export function discoverFanEntities(hass: HomeAssistant, fanEntityId: string): FanEntities {
  const result: FanEntities = { fan: fanEntityId };
  const fanEntry = hass.entities[fanEntityId];

  if (!fanEntry?.device_id) {
    return result;
  }

  const deviceId = fanEntry.device_id;
  const siblings = (Object.entries(hass.entities) as Array<[string, EntityRegistryEntry]>).filter(
    ([, entry]) => entry.device_id === deviceId && entry.disabled_by === undefined,
  );

  for (const [entityId] of siblings) {
    if (entityId === fanEntityId) {
      continue;
    }

    if (entityId.startsWith('light.') && entityId.endsWith('_light')) {
      result.light = entityId;
    } else if (entityId.startsWith('select.') && entityId.endsWith('_color')) {
      result.color = entityId;
    } else if (entityId.startsWith('switch.') && entityId.endsWith('_direction')) {
      result.direction = entityId;
    } else if (entityId.startsWith('switch.') && entityId.endsWith('_mute')) {
      result.mute = entityId;
    } else if (entityId.startsWith('sensor.') && entityId.endsWith('_timer')) {
      result.timer = entityId;
    } else if (entityId.startsWith('button.') && entityId.endsWith('_cooldown_1h')) {
      result.cooldown1h = entityId;
    } else if (entityId.startsWith('button.') && entityId.endsWith('_cooldown_2h')) {
      result.cooldown2h = entityId;
    } else if (entityId.startsWith('button.') && entityId.endsWith('_cooldown_4h')) {
      result.cooldown4h = entityId;
    }
  }

  return result;
}

export function getEntityState(hass: HomeAssistant, entityId: string): string | undefined {
  return hass.states[entityId]?.state;
}

export function isEntityOn(hass: HomeAssistant, entityId: string): boolean {
  const state = getEntityState(hass, entityId);
  return state === 'on' || state === 'ON';
}

export function getFanSpeed(hass: HomeAssistant, fanEntityId: string): string | undefined {
  return hass.states[fanEntityId]?.attributes?.preset_mode as string | undefined;
}

export function getTimerInfo(
  hass: HomeAssistant,
  timerEntityId: string,
): { duration: number; remaining: number } | undefined {
  const state = getEntityState(hass, timerEntityId);

  if (!state) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(state) as { duration?: number; remaining?: number };
    return { duration: parsed.duration ?? 0, remaining: parsed.remaining ?? 0 };
  } catch {
    return undefined;
  }
}
