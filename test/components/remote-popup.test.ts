import { afterEach, describe, expect, it, vi } from 'vitest';
import '../../src/components/remote-popup';

import type { HomeAssistant } from '../../src/types/home-assistant';
import type { FanEntities } from '../../src/utils/device-entities';

type PopupElement = HTMLElement & {
  hass?: HomeAssistant;
  entities?: FanEntities;
  updateComplete: Promise<void>;
};

const mockCallService = vi.fn();

function createMockHass(overrides: Record<string, { state: string; attributes?: Record<string, unknown> }> = {}): HomeAssistant {
  const states: Record<string, { state: string; attributes: Record<string, unknown>; entity_id: string; last_changed: string; last_updated: string }> = {};
  for (const [id, data] of Object.entries(overrides)) {
    states[id] = {
      state: data.state,
      attributes: data.attributes ?? {},
      entity_id: id,
      last_changed: '',
      last_updated: '',
    };
  }
  return {
    states,
    entities: {},
    callService: mockCallService,
    callWS: vi.fn(),
  };
}

function createFullEntities(): FanEntities {
  return {
    fan: 'fan.test_fan',
    light: 'light.test_light',
    color: 'select.test_color',
    direction: 'switch.test_direction',
    mute: 'switch.test_mute',
    timer: 'sensor.test_timer',
    cooldown1h: 'button.test_cooldown_1h',
    cooldown2h: 'button.test_cooldown_2h',
    cooldown4h: 'button.test_cooldown_4h',
  };
}

function createFullHass(): HomeAssistant {
  return createMockHass({
    'fan.test_fan': { state: 'on', attributes: { preset_mode: 'speed3' } },
    'light.test_light': { state: 'off', attributes: {} },
    'select.test_color': { state: 'white', attributes: {} },
    'switch.test_direction': { state: 'on', attributes: {} },
    'switch.test_mute': { state: 'off', attributes: {} },
    'sensor.test_timer': { state: JSON.stringify({ duration: 60, remaining: 30 }), attributes: {} },
  });
}

async function renderPopup(hass?: HomeAssistant, entities?: FanEntities): PopupElement {
  const element = document.createElement('create-fan-remote-popup') as PopupElement;
  if (hass) element.hass = hass;
  if (entities) element.entities = entities;
  document.body.appendChild(element);
  await element.updateComplete;
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  mockCallService.mockReset();
});

describe('create-fan-remote-popup', () => {
  it('renders all 6 speed buttons', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const speedBtns = element.shadowRoot!.querySelectorAll('.speed-btn');
    expect(speedBtns.length).toBe(6);
    const texts = Array.from(speedBtns).map((btn) => btn.textContent?.trim());
    expect(texts).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('highlights current speed', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const speedBtns = element.shadowRoot!.querySelectorAll('.speed-btn');
    const activeBtns = element.shadowRoot!.querySelectorAll('.speed-btn.active');
    expect(activeBtns.length).toBe(1);
    expect(activeBtns[0].textContent?.trim()).toBe('3');
    expect(speedBtns[2].classList.contains('active')).toBe(true);
  });

  it('speed button click calls callFanSpeed with correct preset', async () => {
    const hass = createFullHass();
    const spy = vi.spyOn(hass, 'callService');
    const element = await renderPopup(hass, createFullEntities());
    const speedBtns = element.shadowRoot!.querySelectorAll('.speed-btn');

    (speedBtns[4] as HTMLElement).click();
    expect(spy).toHaveBeenCalledWith('fan', 'set_preset_mode', {
      entity_id: 'fan.test_fan',
      preset_mode: 'speed5',
    });
  });

  it('speed button click also calls turn_on if fan was off', async () => {
    const hass = createMockHass({
      'fan.test_fan': { state: 'off', attributes: {} },
      'light.test_light': { state: 'off', attributes: {} },
      'select.test_color': { state: 'white', attributes: {} },
      'switch.test_direction': { state: 'on', attributes: {} },
      'switch.test_mute': { state: 'off', attributes: {} },
      'sensor.test_timer': { state: JSON.stringify({ duration: 60, remaining: 30 }), attributes: {} },
    });
    const spy = vi.spyOn(hass, 'callService');
    const entities = createFullEntities();
    const element = await renderPopup(hass, entities);
    const speedBtns = element.shadowRoot!.querySelectorAll('.speed-btn');

    (speedBtns[1] as HTMLElement).click();
    expect(spy).toHaveBeenCalledWith('fan', 'set_preset_mode', {
      entity_id: 'fan.test_fan',
      preset_mode: 'speed2',
    });
    expect(spy).toHaveBeenCalledWith('fan', 'turn_on', {
      entity_id: 'fan.test_fan',
    });
  });

  it('light toggle exists when light entity present', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const lightSection = element.shadowRoot!.querySelector('.section-label');
    const labels = Array.from(element.shadowRoot!.querySelectorAll('.section-label')).map(
      (el) => el.textContent?.trim(),
    );
    expect(labels).toContain('Light');
    const toggleRows = element.shadowRoot!.querySelectorAll('.toggle-row');
    expect(toggleRows.length).toBeGreaterThanOrEqual(1);
  });

  it('light toggle does not render when light entity absent', async () => {
    const entities = createFullEntities();
    delete entities.light;
    const element = await renderPopup(createFullHass(), entities);
    const labels = Array.from(element.shadowRoot!.querySelectorAll('.section-label')).map(
      (el) => el.textContent?.trim(),
    );
    expect(labels).not.toContain('Light');
  });

  it('light toggle click calls callLightToggle', async () => {
    const hass = createFullHass();
    const spy = vi.spyOn(hass, 'callService');
    const element = await renderPopup(hass, createFullEntities());

    const sections = element.shadowRoot!.querySelectorAll('.section');
    let lightButton: HTMLElement | null = null;
    for (const section of sections) {
      const label = section.querySelector('.section-label');
      if (label?.textContent?.trim() === 'Light') {
        lightButton = section.querySelector('button') as HTMLElement;
        break;
      }
    }
    expect(lightButton).not.toBeNull();
    lightButton!.click();
    expect(spy).toHaveBeenCalledWith('light', 'toggle', {
      entity_id: 'light.test_light',
    });
  });

  it('color pills exist with correct options', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const pills = element.shadowRoot!.querySelectorAll('.pill');
    expect(pills.length).toBe(2);
    expect(pills[0].textContent?.trim()).toBe('White');
    expect(pills[1].textContent?.trim()).toBe('Yellow');
  });

  it('color pill highlights current selection', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const pills = element.shadowRoot!.querySelectorAll('.pill');
    expect(pills[0].classList.contains('active')).toBe(true);
    expect(pills[1].classList.contains('active')).toBe(false);
  });

  it('color pill click calls callSelectOption', async () => {
    const hass = createFullHass();
    const spy = vi.spyOn(hass, 'callService');
    const element = await renderPopup(hass, createFullEntities());
    const pills = element.shadowRoot!.querySelectorAll('.pill');

    (pills[1] as HTMLElement).click();
    expect(spy).toHaveBeenCalledWith('select', 'select_option', {
      entity_id: 'select.test_color',
      option: 'yellow',
    });
  });

  it('direction toggle exists', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const labels = Array.from(element.shadowRoot!.querySelectorAll('.section-label')).map(
      (el) => el.textContent?.trim(),
    );
    expect(labels).toContain('Direction');
    const allSpans = element.shadowRoot!.querySelectorAll('.toggle-row-label span');
    const texts = Array.from(allSpans).map((s) => s.textContent?.trim());
    expect(texts).toContain('Clockwise');
  });

  it('direction toggle click calls callSwitchToggle', async () => {
    const hass = createFullHass();
    const spy = vi.spyOn(hass, 'callService');
    const element = await renderPopup(hass, createFullEntities());

    const sections = element.shadowRoot!.querySelectorAll('.section');
    let dirButton: HTMLElement | null = null;
    for (const section of sections) {
      const label = section.querySelector('.section-label');
      if (label?.textContent?.trim() === 'Direction') {
        dirButton = section.querySelector('button') as HTMLElement;
        break;
      }
    }
    expect(dirButton).not.toBeNull();
    dirButton!.click();
    expect(spy).toHaveBeenCalledWith('switch', 'toggle', {
      entity_id: 'switch.test_direction',
    });
  });

  it('mute toggle exists', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const labels = Array.from(element.shadowRoot!.querySelectorAll('.section-label')).map(
      (el) => el.textContent?.trim(),
    );
    expect(labels).toContain('Mute');
  });

  it('mute toggle click calls callSwitchToggle', async () => {
    const hass = createFullHass();
    const spy = vi.spyOn(hass, 'callService');
    const element = await renderPopup(hass, createFullEntities());

    const sections = element.shadowRoot!.querySelectorAll('.section');
    let muteButton: HTMLElement | null = null;
    for (const section of sections) {
      const label = section.querySelector('.section-label');
      if (label?.textContent?.trim() === 'Mute') {
        muteButton = section.querySelector('button') as HTMLElement;
        break;
      }
    }
    expect(muteButton).not.toBeNull();
    muteButton!.click();
    expect(spy).toHaveBeenCalledWith('switch', 'toggle', {
      entity_id: 'switch.test_mute',
    });
  });

  it('timer buttons exist (1h, 2h, 4h)', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const timerBtns = element.shadowRoot!.querySelectorAll('.timer-btn');
    expect(timerBtns.length).toBe(3);
    const texts = Array.from(timerBtns).map((btn) => btn.textContent?.trim());
    expect(texts).toEqual(['1h', '2h', '4h']);
  });

  it('timer button click calls callButtonPress', async () => {
    const hass = createFullHass();
    const spy = vi.spyOn(hass, 'callService');
    const element = await renderPopup(hass, createFullEntities());
    const timerBtns = element.shadowRoot!.querySelectorAll('.timer-btn');

    (timerBtns[0] as HTMLElement).click();
    expect(spy).toHaveBeenCalledWith('button', 'press', {
      entity_id: 'button.test_cooldown_1h',
    });
  });

  it('power button toggles fan', async () => {
    const hass = createFullHass();
    const spy = vi.spyOn(hass, 'callService');
    const element = await renderPopup(hass, createFullEntities());
    const powerBtn = element.shadowRoot!.querySelector('.power-btn') as HTMLElement;

    expect(powerBtn).not.toBeNull();
    powerBtn.click();
    expect(spy).toHaveBeenCalledWith('fan', 'toggle', {
      entity_id: 'fan.test_fan',
    });
  });

  it('shows ON when fan is on', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const powerBtn = element.shadowRoot!.querySelector('.power-btn') as HTMLElement;
    expect(powerBtn.textContent?.trim()).toBe('ON');
    expect(powerBtn.classList.contains('active')).toBe(true);
  });

  it('shows OFF when fan is off', async () => {
    const hass = createMockHass({
      'fan.test_fan': { state: 'off', attributes: {} },
    });
    const element = await renderPopup(hass, { fan: 'fan.test_fan' });
    const powerBtn = element.shadowRoot!.querySelector('.power-btn') as HTMLElement;
    expect(powerBtn.textContent?.trim()).toBe('OFF');
    expect(powerBtn.classList.contains('active')).toBe(false);
  });

  it('renders timer display when timer has remaining time', async () => {
    const element = await renderPopup(createFullHass(), createFullEntities());
    const timerDisplay = element.shadowRoot!.querySelector('create-fan-timer-display');
    expect(timerDisplay).not.toBeNull();
  });

  it('does not render timer section when no cooldown entities', async () => {
    const hass = createMockHass({
      'fan.test_fan': { state: 'on', attributes: { preset_mode: 'speed3' } },
    });
    const element = await renderPopup(hass, { fan: 'fan.test_fan' });
    const labels = Array.from(element.shadowRoot!.querySelectorAll('.section-label')).map(
      (el) => el.textContent?.trim(),
    );
    expect(labels).not.toContain('Timer');
    const timerBtns = element.shadowRoot!.querySelectorAll('.timer-btn');
    expect(timerBtns.length).toBe(0);
  });
});
