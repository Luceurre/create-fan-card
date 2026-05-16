export function isBrowserModAvailable(): boolean {
  return typeof (window as any).browser_mod !== 'undefined';
}

export interface PopupConfig {
  title: string;
  content: Record<string, unknown>;
  adaptive?: boolean;
}

export function openPopup(
  element: HTMLElement,
  config: PopupConfig
): void {
  if (isBrowserModAvailable()) {
    const event = new CustomEvent('ll-custom', {
      bubbles: true,
      composed: true,
      detail: {
        browser_mod: {
          service: 'browser_mod.popup',
          data: {
            title: config.title,
            content: config.content,
          },
        },
      },
    });
    document.body.dispatchEvent(event);
  } else {
    const entityId = (config.content as Record<string, unknown>).entity as string | undefined;
    if (entityId) {
      const event = new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId },
      });
      element.dispatchEvent(event);
    }
  }
}

export function openMoreInfo(element: HTMLElement, entityId: string): void {
  const event = new CustomEvent('hass-more-info', {
    bubbles: true,
    composed: true,
    detail: { entityId },
  });
  element.dispatchEvent(event);
}
