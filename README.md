# Space Galactica

An original browser-first retro arcade survival shooter for desktop, mobile and tablets.

## Run locally

Use a local static server from the project folder. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. A local server is recommended because the game uses native JavaScript modules.

## Development checks

Requires Node.js 22 or later:

```bash
npm test
```

The tests use Node's built-in test runner; no third-party packages are required.

## Phase 1 — Foundation

- Deep Space and Deep Sea mode selection
- Responsive canvas sizing with capped high-DPI rendering
- Keyboard movement (WASD / arrow keys)
- Pointer and touch-drag movement with pointer identity tracking
- Pause, resume, restart and automatic pause when the tab is hidden
- Separate game, input, rendering and player modules
- Collision helper functions
- Automated tests and GitHub Actions checks

## Phase 2 — Core Combat

- Automatic primary-weapon fire and player/enemy projectiles
- Three enemy classes: standard drone, fast scout and armoured tank
- Enemy movement patterns and aimed return fire
- Projectile hits and ship-to-enemy collision damage
- Hull health, rechargeable-by-pickup-ready shield capacity, and three starting lives
- Score for destroyed enemies (score is not currency)
- Endless escalating enemy waves with short clear-wave intermissions
- Combat HUD, game-over screen and basic impact/explosion particles
- Optional synthesized retro hit/destruction sounds with an in-game sound toggle
- Deep Space and Deep Sea visual palettes retained

Meteorite waves, workshop, bosses, general drops, upgrades, currency, and the completed-cycle progression are reserved for later phases.

## Phase 4 — Drops and rewards

- Rare enemy-kill salvage drops with a cap of three active reward pickups at once
- Four distinct rewards: temporary salvage credits, hull repair, shield restoration, and Overcharge cooldown reduction
- Reward pickups have separate visuals and fall away if not collected
- Full-health, full-shield, and already-ready Overcharge pickups are not wasted on collection
- Salvage credits are run-only, reset when a new run starts, and are separate from score and permanent weapon unlocks
- Scheduled weapon pickups remain a separate Phase 3 system

## Controls

- Move: WASD or arrow keys
- Touch devices: drag on the playfield
- Weapon: automatic fire
- Pause/resume: Pause button, P key, or Escape

## Phase 3 — Weapons and abilities

- Twenty distinct primary weapons with different firing patterns, rates, damage and projectile behaviour
- Five starter weapons; further weapons unlock through score milestones and persist in browser storage
- Two scheduled weapon pickup drops per ten-wave cycle (on enemy waves 3 and 6)
- A collected weapon replaces the currently equipped weapon and remains equipped until another pickup is collected
- Piercing projectile support
- Overcharge area blast with a 12-second cooldown
- Keyboard and on-screen ability controls
