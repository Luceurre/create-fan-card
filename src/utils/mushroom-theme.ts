import { css } from 'lit';

export const mushroomTheme = css`
  :host {
    --mush-spacing: 12px;
    --mush-card-primary-color: var(--primary-text-color);
    --mush-card-secondary-color: var(--secondary-text-color);
    --mush-card-bg-color: var(--card-background-color);
    --mush-border-radius: 12px;
    --mush-control-border-radius: 12px;
    --mush-control-height: 42px;
    --mush-control-icon-size: 0.5em;
    --mush-icon-size: 40px;
    --mush-shape-size: 48px;
    --mush-shape-threshold: 1;
    --mush-shape-border-radius: 50%;
    --mush-badge-size: 16px;
    --mush-badge-border-radius: 50%;
    --mush-rgb-state-fan: var(--rgb-state-fan-color, 61, 153, 230);
    --mush-rgb-state-light: var(--rgb-state-light-color, 255, 197, 71);
    --mush-rgb-state-switch: var(--rgb-state-switch-color, 211, 129, 53);
    --mush-rgb-active: var(--rgb-active-color, 255, 197, 71);
    --mush-rgb-unavailable: var(--rgb-unavailable-color, 189, 189, 189);
    --mush-rgb-info: var(--rgb-info-color, 158, 158, 158);
  }
`;

export const mushroomCardStyle = css`
  ha-card {
    display: flex;
    flex-direction: column;
    padding: var(--mush-spacing);
    background: var(--mush-card-bg-color);
    border-radius: var(--mush-border-radius);
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }
  
  .card-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--mush-spacing);
  }

  .card-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--mush-spacing);
    cursor: pointer;
  }

  .card-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding-top: var(--mush-spacing);
  }

  .shape-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--mush-shape-size);
    height: var(--mush-shape-size);
    border-radius: var(--mush-shape-border-radius);
    background: rgba(var(--mush-rgb-state-fan), 0.2);
    flex-shrink: 0;
  }

  .shape-icon.light {
    background: rgba(var(--mush-rgb-state-light), 0.2);
  }

  .state-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .primary {
    color: var(--mush-card-primary-color);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .secondary {
    color: var(--mush-card-secondary-color);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toggle-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--mush-control-height);
    height: var(--mush-control-height);
    border-radius: var(--mush-control-border-radius);
    border: none;
    background: rgba(var(--mush-rgb-info), 0.2);
    cursor: pointer;
    transition: background 0.2s ease;
    flex-shrink: 0;
    color: var(--mush-card-secondary-color);
  }

  .toggle-button.active {
    background: rgba(var(--mush-rgb-active), 0.25);
    color: var(--primary-color);
  }

  .toggle-button:hover {
    background: rgba(var(--mush-rgb-info), 0.3);
  }

  .toggle-button.active:hover {
    background: rgba(var(--mush-rgb-active), 0.35);
  }

  ha-icon {
    --mdi-icon-size: 20px;
  }
`;
