import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isBrowserModAvailable, openMoreInfo, openPopup } from '../../src/utils/popup';

describe('popup utils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when browser_mod is registered', () => {
    vi.spyOn(customElements, 'get').mockReturnValue({} as CustomElementConstructor);

    expect(isBrowserModAvailable()).toBe(true);
  });

  it('returns false when browser_mod is not registered', () => {
    vi.spyOn(customElements, 'get').mockReturnValue(undefined);

    expect(isBrowserModAvailable()).toBe(false);
  });

  it('opens browser_mod popup via ll-custom event on document.body', () => {
    vi.spyOn(customElements, 'get').mockReturnValue({} as CustomElementConstructor);
    const element = document.createElement('div');
    const dispatchSpy = vi.spyOn(document.body, 'dispatchEvent');

    openPopup(element, {
      title: 'Fan Controls',
      content: { entity: 'fan.living_room' },
      adaptive: false,
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('ll-custom');
    expect(event.detail).toEqual({
      browser_mod: {
        service: 'browser_mod.popup',
        data: {
          title: 'Fan Controls',
          content: { entity: 'fan.living_room' },
        },
      },
    });
  });

  it('falls back to hass-more-info when browser_mod is unavailable', () => {
    vi.spyOn(customElements, 'get').mockReturnValue(undefined);
    const element = document.createElement('div');
    const dispatchSpy = vi.fn();
    Object.defineProperty(element, 'dispatchEvent', {
      value: dispatchSpy,
    });

    openPopup(element, {
      title: 'Fan Controls',
      content: { entity: 'fan.living_room' },
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('hass-more-info');
    expect(event.detail).toEqual({ entityId: 'fan.living_room' });
  });

  it('opens more info dialog directly', () => {
    const element = document.createElement('div');
    const dispatchSpy = vi.fn();
    Object.defineProperty(element, 'dispatchEvent', {
      value: dispatchSpy,
    });

    openMoreInfo(element, 'fan.living_room');

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('hass-more-info');
    expect(event.detail).toEqual({ entityId: 'fan.living_room' });
  });
});
