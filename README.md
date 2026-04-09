# next-ppr-debugger

[![npm version](https://img.shields.io/npm/v/next-ppr-debugger?color=cb3837&label=npm)](https://www.npmjs.com/package/next-ppr-debugger)
[![CI](https://github.com/Avvi101/next-ppr-debugger/actions/workflows/ci.yml/badge.svg)](https://github.com/Avvi101/next-ppr-debugger/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Avvi101/next-ppr-debugger/actions/workflows/codeql.yml/badge.svg)](https://github.com/Avvi101/next-ppr-debugger/actions/workflows/codeql.yml)

Visualize which parts of your Next.js UI are intended to be static, dynamic, or streaming while you roll out Partial Prerendering-friendly architecture.

## Install

```bash
npm install next-ppr-debugger
```

## Why

PPR adoption gets confusing fast because the split between static shell and dynamic regions is not obvious from the rendered page alone. This package adds a development overlay so teams can literally see their rendering boundaries.

## Features

- Development-only overlay with a built-in toggle
- Explicit region labels for static, dynamic, and streaming areas
- Keyboard shortcut support for quick inspection
- Lightweight client component with typed API surface

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

## Compatibility

- Node.js `>=18`
- Next.js `14`, `15`, and `16`
- React `18` and `19`

## Reliability

- Unit-tested overlay toggling and region labeling behavior
- CI runs on every push and pull request
- CodeQL and Dependabot configs are included for ongoing maintenance
- Releases are prepared for npm trusted publishing with provenance

## Security

Please report security issues through GitHub private vulnerability reporting when enabled, or by following [SECURITY.md](SECURITY.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development and release notes.

## License

MIT

