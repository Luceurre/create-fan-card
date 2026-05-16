# Create Fan Card

A Mushroom-styled Home Assistant Lovelace card for controlling Create Ikohs ceiling fans via ESPSomfy-RTS.

## Features

- Compact card with fan/light toggles and speed indicator dots
- Tap card to open full remote popup with all controls
- Auto-discovers all companion entities from the fan's device
- Mushroom-style visuals -- works standalone, no Mushroom dependency required
- Falls back to HA's native more-info dialog if Browser Mod is not installed
- Optimistic state tracking for passive RF fans

## Prerequisites

- Home Assistant with MQTT integration configured
- [ESPSomfy-RTS](https://github.com/rstrouse/ESPSomfy-RTS) firmware with fan support (or the Create Ikohs fork)
- Optional: [Browser Mod](https://github.com/thomasloven/hass-browser_mod) for the popup remote experience

## Installation

### HACS (recommended)

1. Go to HACS > Frontend > Custom Repositories
2. Add this repository URL
3. Install "Create Fan Card"
4. Restart Home Assistant (or refresh the Lovelace dashboard)

### Manual

1. Copy `dist/create-fan-card.js` to your `www/community/create-fan-card/` directory
2. Add the resource in your Lovelace dashboard configuration:

```yaml
resources:
  - url: /community/create-fan-card/create-fan-card.js
    type: module
```

## Configuration

### Minimal

```yaml
type: custom:create-fan-card
entity: fan.living_room
```

### Full

```yaml
type: custom:create-fan-card
entity: fan.living_room
light_entity: light.living_room_light  # optional, auto-detected
name: Living Room Fan                  # optional, uses friendly_name
```

### Options

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entity` | string | Yes | Fan entity ID (e.g. `fan.living_room`) |
| `light_entity` | string | No | Light entity ID. Auto-detected from the fan's device if omitted. |
| `name` | string | No | Display name. Defaults to the entity's friendly name. |

## Auto-discovered Entities

When configured with a fan entity, the card automatically discovers these companion entities sharing the same device:

| Entity | Domain | Purpose |
|--------|--------|---------|
| Light | `light.*_light` | Toggle fan light on/off |
| Color | `select.*_color` | Switch between white and yellow light |
| Direction | `switch.*_direction` | Toggle clockwise / counter-clockwise rotation |
| Mute | `switch.*_mute` | Toggle fan mute mode |
| Timer | `sensor.*_timer` | Displays active cooldown timer remaining time |
| Cooldown 1h | `button.*_cooldown_1h` | Start 1-hour cooldown timer |
| Cooldown 2h | `button.*_cooldown_2h` | Start 2-hour cooldown timer |
| Cooldown 4h | `button.*_cooldown_4h` | Start 4-hour cooldown timer |

All entities are published by the ESPSomfy-RTS firmware via MQTT auto-discovery.

## Compact Card

The card shows:

- Fan icon (spinning animation when fan is on)
- Fan name and current speed text (e.g. "Speed 3" or "Off")
- Speed indicator dots (1-6 filled dots)
- Active cooldown timer remaining time
- Fan toggle button
- Light toggle button (if light entity exists)

## Remote Popup

Tapping the card body opens the full remote with:

- **Power** -- toggle fan on/off
- **Speed** -- 6 speed buttons (1-6), current speed highlighted; automatically turns fan on if selecting speed while off
- **Light** -- toggle light on/off
- **Color** -- white/yellow pill selector
- **Direction** -- toggle clockwise/counter-clockwise
- **Mute** -- toggle mute mode
- **Timer** -- cooldown buttons (1h, 2h, 4h) with active timer display

## License

MIT
