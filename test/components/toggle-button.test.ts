import { afterEach, describe, expect, it, vi } from 'vitest';
import '../../src/components/toggle-button';

type ToggleElement = HTMLElement & {
  active: boolean;
  icon: string;
  label: string;
  updateComplete: Promise<void>;
};

async function renderToggle(props: Partial<Pick<ToggleElement, 'active' | 'icon' | 'label'>> = {}) {
  const element = document.createElement('create-fan-toggle') as ToggleElement;
  Object.assign(element, props);
  document.body.appendChild(element);
  await element.updateComplete;
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('create-fan-toggle', () => {
  it('renders with the correct icon', async () => {
    const element = await renderToggle({ icon: 'mdi:fan' });
    const icon = element.shadowRoot?.querySelector('ha-icon') as HTMLElement & { icon?: string } | null;

    expect(icon?.icon).toBe('mdi:fan');
  });

  it('applies the active class when active=true', async () => {
    const element = await renderToggle({ active: true });
    const button = element.shadowRoot?.querySelector('button');

    expect(button).not.toBeNull();
    expect(button?.classList.contains('active')).toBe(true);
  });

  it("dispatches 'toggle-click' with the active state", async () => {
    const element = await renderToggle({ active: true });
    const handler = vi.fn();
    element.addEventListener('toggle-click', handler);

    element.shadowRoot?.querySelector('button')?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<{ active: boolean }>;
    expect(event.detail).toEqual({ active: true });
  });

  it('calls stopPropagation on click', async () => {
    const element = await renderToggle();
    const stopPropagation = vi.spyOn(Event.prototype, 'stopPropagation');

    element.shadowRoot?.querySelector('button')?.click();

    expect(stopPropagation).toHaveBeenCalled();
  });
});
