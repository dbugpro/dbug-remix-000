# MAGICUBE Corridor Interface — BUGWORLD

A browser-based navigational interface for the BUGWORLD lattice schema. This system simulates sequential traversal through MAGICUBE instances.

## Progression Logic

The corridor is programmable and follows a strict sequential progression:

- **Initialization**: The system starts at instance `000`.
- **Traversal**: Entering any side matrix cell (Doors 0-9) increments the instance counter.
- **Access Protocol**: The Far Door (Progression Matrix) remains electronically locked while the instance count is less than `3`.
- **System Sync**: Once the counter reaches `003`, the Far Door unlocks, permitting passage to the next MAGICUBE instance in the lattice.
- **Telemetry**: State is synchronized with the URL (`?cell=XXX`) and can be monitored via debug telemetry (`?debug=true`).

## Navigation

- **Left Wall**: Even-numbered cells (0, 2, 4, 6, 8).
- **Right Wall**: Odd-numbered cells (1, 3, 5, 7, 9).
- **Far End**: Progression / Next Instance bypass.
- **Near End**: Exit / Return to previous state.

## Technical Stack

- **Framework**: React 18 + Vite + TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS + Custom 3D CSS Transforms
- **Icons**: Lucide React

---
*System reset successful. Ready for navigation.*
