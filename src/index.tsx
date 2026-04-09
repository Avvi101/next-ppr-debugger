'use client';

import * as React from 'react';

export type PPRMode = 'static' | 'dynamic' | 'streaming';

export interface PPRDebuggerProps {
  children: React.ReactNode;
  defaultVisible?: boolean;
  enabled?: boolean;
}

export interface PPRRegionProps {
  children: React.ReactNode;
  label: string;
  mode: PPRMode;
  reason?: string;
  display?: React.CSSProperties['display'];
}

interface PPRDebuggerContextValue {
  visible: boolean;
}

const PPRDebuggerContext = React.createContext<PPRDebuggerContextValue>({
  visible: false
});

const isDev = process.env.NODE_ENV === 'development';

export function PPRDebugger({
  children,
  defaultVisible = true,
  enabled = true
}: PPRDebuggerProps): React.ReactElement {
  const [visible, setVisible] = React.useState(defaultVisible);
  const isEnabled = isDev && enabled;

  React.useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.shiftKey && event.key.toLowerCase() === 'p') {
        setVisible((value) => !value);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <PPRDebuggerContext.Provider value={{ visible }}>
      {children}
      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 1000,
          width: 220,
          borderRadius: 18,
          border: '1px solid rgba(148, 163, 184, 0.35)',
          background: 'rgba(15, 23, 42, 0.92)',
          color: '#f8fafc',
          padding: '0.9rem',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.32)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700 }}>PPR Debugger</div>
        <div style={{ marginTop: '0.35rem', fontSize: 12, opacity: 0.8 }}>
          Shift + P toggles region overlays
        </div>
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          style={{
            marginTop: '0.75rem',
            width: '100%',
            border: 0,
            borderRadius: 10,
            padding: '0.65rem 0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: visible ? '#e2e8f0' : '#334155',
            color: visible ? '#0f172a' : '#f8fafc'
          }}
        >
          {visible ? 'Hide overlays' : 'Show overlays'}
        </button>
        <LegendSwatch color="#22c55e" label="Static" />
        <LegendSwatch color="#38bdf8" label="Dynamic / Streaming" />
      </div>
    </PPRDebuggerContext.Provider>
  );
}

export function PPRRegion({
  children,
  label,
  mode,
  reason,
  display = 'block'
}: PPRRegionProps): React.ReactElement {
  const { visible } = React.useContext(PPRDebuggerContext);
  const tone = getTone(mode);

  return (
    <div
      data-ppr-mode={mode}
      style={{
        position: 'relative',
        display,
        outline: visible ? `2px solid ${tone.border}` : 'none',
        outlineOffset: visible ? 2 : 0,
        borderRadius: visible ? 12 : 0,
        transition: 'outline 120ms ease'
      }}
    >
      {children}
      {visible ? (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 30,
            maxWidth: 260,
            borderRadius: 999,
            padding: '0.35rem 0.55rem',
            fontSize: 11,
            fontWeight: 700,
            background: tone.badge,
            color: tone.text,
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.22)'
          }}
        >
          {label} · {mode}
          {reason ? (
            <span style={{ display: 'block', marginTop: 4, fontWeight: 500 }}>{reason}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function LegendSwatch({
  color,
  label
}: {
  color: string;
  label: string;
}): React.ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: '0.65rem',
        fontSize: 12
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: color,
          display: 'inline-block'
        }}
      />
      {label}
    </div>
  );
}

function getTone(mode: PPRMode): {
  border: string;
  badge: string;
  text: string;
} {
  if (mode === 'static') {
    return {
      border: '#22c55e',
      badge: 'rgba(34, 197, 94, 0.95)',
      text: '#052e16'
    };
  }

  return {
    border: '#38bdf8',
    badge: 'rgba(56, 189, 248, 0.95)',
    text: '#082f49'
  };
}

