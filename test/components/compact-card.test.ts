import { afterEach, describe, expect, it, vi } from 'vitest';
import '../../src/components/compact-card';

import type { HomeAssistant } from '../../src/types/home-assistant';
import type { FanEntities } from '../../src/utils/device-entities';

type CompactCardElement = HTMLElement & {
  hass?: HomeAssistant;
  entityId: string;
  name: string;
  entities?: FanEntities;
  updateComplete: Promise<void>;
};

function createMockHass(): HomeAssistant {
  return {
    states: {
      'fan.living_room': {
        state: 'on',
        attributes: {
          friendly_name: 'Living Room Fan',
          preset_mode: 'Speed 3',
        },
        entity_id: 'fan.living_room',
        last_changed: '2025-01-01T00:00:00Z',
        last_updated: '2025-01-01T00:00:00Z',
      },
      'light.living_room_light': {
        state: 'on',
        attributes: {},
        entity_id: 'light.living_room_light',
        last_changed: '2025-01-01T00:00:00Z',
        last_updated: '2025-01-01T00:00:00Z',
      },
      'sensor.living_room_timer': {
        state: JSON.stringify({ duration: 60, remaining: 30 }),
        attributes: {},
        entity_id: 'sensor.living_room_timer',
        last_changed: '2025-01-01T00:00:00Z',
        last_updated: '2025-01-01T00:00:00Z',
      },
    },
    entities: {},
    callService: vi.fn(),
    callWS: vi.fn().mockResolvedValue(null),
  };
}

function createMockEntities(withLight = true, withTimer = true): FanEntities {
  const entities: FanEntities = { fan: 'fan.living_room' };
  if (withLight) entities.light = 'light.living_room_light';
  if (withTimer) entities.timer = 'sensor.living_room_timer';
  return entities;
}

async function renderCard(overrides: Partial<CompactCardElement> = {}): Promise<CompactCardElement> {
  const element = document.createElement('create-fan-compact-card') as CompactCardElement;
  const hass = overrides.hass ?? createMockHass();
  const entities = overrides.entities ?? createMockEntities();

  element.hass = hass;
  element.entityId = overrides.entityId ?? 'fan.living_room';
  if (overrides.name !== undefined) element.name = overrides.name;
  element.entities = entities;

  document.body.appendChild(element);
  await element.updateComplete;
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('create-fan-compact-card', () => {
  it('renders fan name from friendly_name attribute', async () => {
    const element = await renderCard();
    const primary = element.shadowRoot?.querySelector('.primary');

    expect(primary?.textContent?.trim()).toBe('Living Room Fan');
  });

  it('renders fan name from name prop override', async () => {
    const element = await renderCard({ name: 'My Custom Name' });
    const primary = element.shadowRoot?.querySelector('.primary');

    expect(primary?.textContent?.trim()).toBe('My Custom Name');
  });

  it('renders fan toggle with correct active state', async () => {
    const element = await renderCard();
    const toggles = element.shadowRoot?.querySelectorAll('create-fan-toggle');
    const fanToggle = toggles?.[0] as HTMLElement & { active: boolean; icon: string } | undefined;

    expect(fanToggle).toBeDefined();
    expect(fanToggle!.active).toBe(true);
    expect(fanToggle!.icon).toBe('mdi:fan');
  });

  it('renders light toggle when light entity exists', async () => {
    const element = await renderCard();
    const toggles = element.shadowRoot?.querySelectorAll('create-fan-toggle');

    expect(toggles?.length).toBe(2);
    const lightToggle = toggles![1] as HTMLElement & { active: boolean; icon: string };
    expect(lightToggle.active).toBe(true);
    expect(lightToggle.icon).toBe('mdi:lightbulb');
  });

  it('does NOT render light toggle when no light entity', async () => {
    const element = await renderCard({
      entities: createMockEntities(false, false),
    });
    const toggles = element.shadowRoot?.querySelectorAll('create-fan-toggle');

    expect(toggles?.length).toBe(1);
  });

  it('fan toggle-click calls callFanToggle', async () => {
    const hass = createMockHass();
    const element = await renderCard({ hass });

    const fanToggle = element.shadowRoot?.querySelector('create-fan-toggle');
    fanToggle?.dispatchEvent(
      new CustomEvent('toggle-click', {
        bubbles: true,
        composed: true,
        detail: { active: true },
      })
    );

    expect(hass.callService).toHaveBeenCalledWith('fan', 'toggle', {
      entity_id: 'fan.living_room',
    });
  });

  it('light toggle-click calls callLightToggle', async () => {
    const hass = createMockHass();
    const element = await renderCard({ hass });

    const toggles = element.shadowRoot?.querySelectorAll('create-fan-toggle');
    const lightToggle = toggles?.[1];

    lightToggle?.dispatchEvent(
      new CustomEvent('toggle-click', {
        bubbles: true,
        composed: true,
        detail: { active: true },
      })
    );

    expect(hass.callService).toHaveBeenCalledWith('light', 'toggle', {
      entity_id: 'light.living_room_light',
    });
  });

  it('card body click dispatches open-remote event', async () => {
    const entities = createMockEntities();
    const element = await renderCard({ entities });
    const handler = vi.fn();
    element.addEventListener('open-remote', handler);

    const cardContent = element.shadowRoot?.querySelector('.card-content');
    cardContent?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<{
      entityId: string;
      entities: FanEntities;
    }>;
    expect(event.detail.entityId).toBe('fan.living_room');
    expect(event.detail.entities).toBe(entities);
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });
});
