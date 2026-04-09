import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PPRDebugger, PPRRegion } from '../src/index';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('PPRDebugger', () => {
  it('renders only children outside development mode', () => {
    vi.stubEnv('NODE_ENV', 'production');

    render(
      <PPRDebugger>
        <PPRRegion label="Hero" mode="static">
          <div>Hero section</div>
        </PPRRegion>
      </PPRDebugger>
    );

    expect(screen.getByText('Hero section')).toBeTruthy();
    expect(screen.queryByText('PPR Debugger')).toBeNull();
  });

  it('toggles overlay visibility in development mode', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const user = userEvent.setup();

    render(
      <PPRDebugger>
        <PPRRegion label="Hero" mode="static">
          <div>Hero section</div>
        </PPRRegion>
      </PPRDebugger>
    );

    expect(screen.getByText('PPR Debugger')).toBeTruthy();
    expect(screen.getByText(/Hero · static/)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /toggle ppr overlays/i }));

    expect(screen.queryByText(/Hero · static/)).toBeNull();
  });

  it('supports keyboard toggling for overlays', () => {
    vi.stubEnv('NODE_ENV', 'development');

    render(
      <PPRDebugger defaultVisible={false}>
        <PPRRegion label="Feed" mode="dynamic" reason="Session dependent">
          <div>User feed</div>
        </PPRRegion>
      </PPRDebugger>
    );

    expect(screen.queryByText(/Feed · dynamic/)).toBeNull();

    fireEvent.keyDown(window, {
      key: 'P',
      shiftKey: true
    });

    expect(screen.getByText(/Feed · dynamic/)).toBeTruthy();
  });
});

