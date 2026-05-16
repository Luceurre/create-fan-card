import { describe, expect, it } from 'vitest';
import '../../src/components/timer-display';
import { CreateFanTimerDisplay } from '../../src/components/timer-display';

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('CreateFanTimerDisplay', () => {
  it('shows 45m for 120/45', async () => {
    const el = document.createElement('create-fan-timer-display') as CreateFanTimerDisplay;
    el.duration = 120;
    el.remaining = 45;
    document.body.appendChild(el);
    await el.updateComplete;
    await flush();

    expect(el.shadowRoot?.textContent).toContain('45m');
  });

  it('shows 2h 30m for 240/150', async () => {
    const el = document.createElement('create-fan-timer-display') as CreateFanTimerDisplay;
    el.duration = 240;
    el.remaining = 150;
    document.body.appendChild(el);
    await el.updateComplete;
    await flush();

    expect(el.shadowRoot?.textContent).toContain('2h 30m');
  });

  it('shows 1h for 60/60', async () => {
    const el = document.createElement('create-fan-timer-display') as CreateFanTimerDisplay;
    el.duration = 60;
    el.remaining = 60;
    document.body.appendChild(el);
    await el.updateComplete;
    await flush();

    expect(el.shadowRoot?.textContent).toContain('1h');
  });

  it('renders nothing for 0/0', async () => {
    const el = document.createElement('create-fan-timer-display') as CreateFanTimerDisplay;
    el.duration = 0;
    el.remaining = 0;
    document.body.appendChild(el);
    await el.updateComplete;
    await flush();

    expect(el.shadowRoot?.querySelector('ha-icon')).toBeNull();
    expect(el.shadowRoot?.querySelector('span')).toBeNull();
  });

  it('renders nothing for 120/0', async () => {
    const el = document.createElement('create-fan-timer-display') as CreateFanTimerDisplay;
    el.duration = 120;
    el.remaining = 0;
    document.body.appendChild(el);
    await el.updateComplete;
    await flush();

    expect(el.shadowRoot?.querySelector('ha-icon')).toBeNull();
    expect(el.shadowRoot?.querySelector('span')).toBeNull();
  });
});
