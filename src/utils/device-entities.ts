import type { HomeAssistant } from '../types/home-assistant';

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

/**
 * Discover companion entities for a fan by matching entity ID patterns.
 *
 * The ESPSomfy-RTS firmware publishes all fan entities under the same MQTT device,
 * so device_id-based discovery would match ALL fans' entities.
 * Instead, we derive the base name from the fan entity ID and match siblings by prefix.
 *
 * For fan.espsomfyrts_fan_3:
 *   base = "espsomfyrts_fan_3"
 *   light    = light.espsomfyrts_fan_3_light
 *   color    = select.espsomfyrts_fan_3_color
 *   direction= switch.espsomfyrts_fan_3_direction
 *   mute     = switch.espsomfyrts_fan_3_mute
 *   timer    = sensor.espsomfyrts_fan_3_timer
 *   cooldown = button.espsomfyrts_fan_3_cooldown_{1h,2h,4h}
 */
export function discoverFanEntities(hass: HomeAssistant, fanEntityId: string): FanEntities {
  const result: FanEntities = { fan: fanEntityId };

  const dotIndex = fanEntityId.indexOf('.');
  if (dotIndex === -1) return result;
  const base = fanEntityId.substring(dotIndex + 1);

  const candidates: Record<keyof Omit<FanEntities, 'fan'>, string> = {
    light: `light.${base}_light`,
    color: `select.${base}_color`,
    direction: `switch.${base}_direction`,
    mute: `switch.${base}_mute`,
    timer: `sensor.${base}_timer`,
    cooldown1h: `button.${base}_cooldown_1h`,
    cooldown2h: `button.${base}_cooldown_2h`,
    cooldown4h: `button.${base}_cooldown_4h`,
  };

  for (const [key, candidateId] of Object.entries(candidates)) {
    const entry = hass.entities[candidateId];
    if (entry && !entry.disabled_by) {
      result[key] = candidateId;
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
