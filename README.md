# next-ppr-debugger

Visualize which parts of your Next.js UI are intended to be static, dynamic, or streaming while you roll out Partial Prerendering-friendly architecture.

## Install

```bash
npm install next-ppr-debugger
```

## Why

PPR adoption gets confusing fast because the split between static shell and dynamic regions is not obvious from the rendered page alone. This package adds a development overlay so teams can literally see their rendering boundaries.

## Example

```tsx
'use client';

import { PPRDebugger, PPRRegion } from 'next-ppr-debugger';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PPRDebugger>
      <PPRRegion label="Marketing hero" mode="static">
        <Hero />
      </PPRRegion>

      <PPRRegion
        label="User feed"
        mode="dynamic"
        reason="Depends on session and live data"
      >
        {children}
      </PPRRegion>
    </PPRDebugger>
  );
}
```

## API

### `PPRDebugger`

Development-only overlay controller. Includes a toggle button and `Shift + P` keyboard shortcut.

### `PPRRegion`

Wrap a region and label it with:

- `mode="static"` for instantly prerendered UI
- `mode="dynamic"` for request-time regions
- `mode="streaming"` for suspense or streamed content

## Notes

This package focuses on visual annotation and team debugging. Automatic classification of static vs dynamic behavior is not currently exposed by Next.js as a generic runtime API, so the package is designed around explicit region labeling.

