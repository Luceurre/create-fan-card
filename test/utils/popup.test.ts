import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { isBrowserModAvailable, openMoreInfo, openPopup } from '../../src/utils/popup';

describe('popup utils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete (window as any).browser_mod;
  });

  afterEach(() => {
    delete (window as any).browser_mod;
  });

  it('returns true when browser_mod is registered', () => {
    (window as any).browser_mod = {};

    expect(isBrowserModAvailable()).toBe(true);
  });

  it('returns false when browser_mod is not registered', () => {
    expect(isBrowserModAvailable()).toBe(false);
  });

  it('opens browser_mod popup via ll-custom event on document.body', () => {
    (window as any).browser_mod = {};
    const element = document.createElement('div');
    const dispatchSpy = vi.spyOn(document.body, 'dispatchEvent');

    openPopup(element, {
      title: 'Fan Controls',
      content: { entity: 'fan.living_room' },
      adaptive: false,
    });

    const llCustomCalls = dispatchSpy.mock.calls
      .map(call => call[0] as CustomEvent)
      .filter(e => e.type === 'll-custom');
    expect(llCustomCalls.length).toBe(1);
    expect(llCustomCalls[0].detail).toEqual({
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
