import { describe, expect, it } from 'vitest';
import '../../src/components/speed-dots';

async function renderSpeedDots(speed: number) {
  const element = document.createElement('create-fan-speed-dots') as HTMLElement & { speed: number; updateComplete: Promise<void> };
  element.speed = speed;
  document.body.appendChild(element);
  await element.updateComplete;
  return element;
}

describe('create-fan-speed-dots', () => {
  it('renders exactly 6 dots', async () => {
    const element = await renderSpeedDots(0);
    expect(element.shadowRoot?.querySelectorAll('.dot')).toHaveLength(6);
    element.remove();
  });

  it('speed=0 has no active dots', async () => {
    const element = await renderSpeedDots(0);
    expect(element.shadowRoot?.querySelectorAll('.dot.active')).toHaveLength(0);
    element.remove();
  });

  it('speed=3 activates first 3 dots', async () => {
    const element = await renderSpeedDots(3);
    const activeDots = element.shadowRoot?.querySelectorAll('.dot.active');
    expect(activeDots).toHaveLength(3);
    element.remove();
  });

  it('speed=6 activates all dots', async () => {
    const element = await renderSpeedDots(6);
    expect(element.shadowRoot?.querySelectorAll('.dot.active')).toHaveLength(6);
    element.remove();
  });
});
