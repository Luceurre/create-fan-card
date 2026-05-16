export function isBrowserModAvailable(): boolean {
  return customElements.get('browser-mod') !== undefined;
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
  console.log('[create-fan-card] openPopup called', { browserModAvailable: isBrowserModAvailable(), config });
  if (isBrowserModAvailable()) {
    const detail = {
      browser_mod: {
        service: 'browser_mod.popup',
        data: {
          title: config.title,
          content: config.content,
        },
      },
    };
    console.log('[create-fan-card] dispatching ll-custom on document.body', JSON.stringify(detail));
    const event = new CustomEvent('ll-custom', {
      bubbles: true,
      composed: true,
      detail,
    });
    document.body.dispatchEvent(event);
  } else {
    console.log('[create-fan-card] browser_mod not available, falling back to more-info');
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
