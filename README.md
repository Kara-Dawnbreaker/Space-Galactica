# Space Galactica

A browser-first retro arcade survival shooter for desktop, mobile and tablets.

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
- Automated tests for player bounds, movement and collision rules
- GitHub Actions test workflow

Combat, enemies, waves, weapons, drops and progression are intentionally not implemented yet.
