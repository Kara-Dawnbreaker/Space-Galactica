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

The workshop, meteorite waves, bosses, weapon collection, drops, upgrades, currency, and permanent progression are reserved for later phases.

## Controls

- Move: WASD or arrow keys
- Touch devices: drag on the playfield
- Weapon: automatic fire
- Pause/resume: Pause button, P key, or Escape
