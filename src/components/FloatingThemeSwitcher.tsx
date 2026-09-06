'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { runAntigravityTransition } from '@/lib/antigravityCanvas';
import type { Theme } from '@/lib/antigravityCanvas';

// ── Per-theme visual config ────────────────────────────────────────────────────
const THEME_META: Record<Theme, {
  label: string;
  emoji: string;
  orbGradient: string;
  ringColor: string;
  glowColor: string;
}> = {
  dark: {
    label: 'Dark',
    emoji: '🌑',
    orbGradient: 'radial-gradient(circle at 35% 30%, #ff6bbd, #ff2a8d 45%, #7c1fa0 100%)',
    ringColor: '#ff2a8d',
    glowColor: 'rgba(255,42,141,0.85)',
  },
  light: {
    label: 'Light',
    emoji: '☀️',
    orbGradient: 'radial-gradient(circle at 35% 30%, #fef3c7, #fbbf24 45%, #d97706 100%)',
    ringColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.85)',
  },
  violet: {
    label: 'Violet',
    emoji: '💜',
    orbGradient: 'radial-gradient(circle at 35% 30%, #ede9fe, #8b5cf6 45%, #5b21b6 100%)',
    ringColor: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.85)',
  },
  neon: {
    label: 'Neon',
    emoji: '⚡',
    orbGradient: 'radial-gradient(circle at 35% 30%, #a5f3fc, #00f0ff 45%, #0891b2 100%)',
    ringColor: '#00f0ff',
    glowColor: 'rgba(0,240,255,0.85)',
  },
};

const THEME_ORDER: Theme[] = ['dark', 'light', 'violet', 'neon'];

// ── Individual orb button ──────────────────────────────────────────────────────
function ThemeOrb({
  themeKey,
  isActive,
  isAnimating,
  onClick,
  orbRef,
}: {
  themeKey: Theme;
  isActive: boolean;
  isAnimating: boolean;
  onClick: (t: Theme, el: HTMLButtonElement) => void;
  orbRef?: React.Ref<HTMLButtonElement>;
}) {
  const [hovered, setHovered] = useState(false);
  const meta = THEME_META[themeKey];

  return (
    <button
      ref={orbRef}
      onClick={(e) => onClick(themeKey, e.currentTarget)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={isAnimating}
      aria-label={`Switch to ${meta.label} theme`}
      aria-pressed={isActive}
      title={`${meta.emoji} ${meta.label}`}
      style={{
        position: 'relative',
        width: isActive ? 40 : 32,
        height: isActive ? 40 : 32,
        borderRadius: '50%',
        border: isActive
          ? `2.5px solid ${meta.ringColor}`
          : `1.5px solid ${meta.ringColor}44`,
        background: meta.orbGradient,
        boxShadow: isActive
          ? `0 0 0 4px ${meta.ringColor}22, 0 0 18px ${meta.glowColor}, 0 0 36px ${meta.ringColor}44`
          : hovered
          ? `0 0 12px ${meta.glowColor}`
          : `0 0 4px ${meta.ringColor}44`,
        cursor: isAnimating ? 'wait' : isActive ? 'default' : 'pointer',
        transition: 'width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border-color 0.25s ease',
        transform: hovered && !isActive ? 'scale(1.15)' : 'scale(1)',
        flexShrink: 0,
        outline: 'none',
      }}
    >
      {/* Specular highlight */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '18%',
          left: '22%',
          width: '30%',
          height: '20%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)',
          filter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />
      {/* Active indicator ring pulse */}
      {isActive && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: -5,
            borderRadius: '50%',
            border: `1px solid ${meta.ringColor}55`,
            animation: 'agy-active-pulse 2s ease-in-out infinite',
          }}
        />
      )}
    </button>
  );
}

// ── Main floating switcher ─────────────────────────────────────────────────────
export function FloatingThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const activeOrbRef = useRef<HTMLButtonElement>(null);

  const handleSelect = useCallback(
    (nextTheme: Theme, el: HTMLButtonElement) => {
      if (isAnimating || nextTheme === theme) return;

      const rect = el.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      setIsAnimating(true);

      // Singularity body-squeeze effect
      document.body.style.transition = 'transform 0.12s cubic-bezier(0.34,1.56,0.64,1)';
      document.body.style.transform = 'scale(0.984)';
      setTimeout(() => {
        document.body.style.transform = '';
      }, 120);

      // Fire canvas explosion, then apply theme
      runAntigravityTransition(originX, originY, nextTheme, () => {
        setIsAnimating(false);
      });

      setTimeout(() => {
        setTheme(nextTheme);
      }, 60);
    },
    [isAnimating, theme, setTheme]
  );

  return (
    <>
      <style>{`
        @keyframes agy-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes agy-active-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 0.15; transform: scale(1.25); }
        }
        @keyframes agy-pill-in {
          from { opacity: 0; transform: translateY(12px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Floating pill container */}
      <div
        role="group"
        aria-label="Theme switcher"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 999,
          background: 'rgba(10, 8, 22, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset',
          animation: 'agy-float 3.8s ease-in-out infinite, agy-pill-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        {/* Subtle label */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            userSelect: 'none',
            paddingRight: 2,
          }}
        >
          Theme
        </span>

        {/* Divider */}
        <span
          aria-hidden="true"
          style={{
            width: 1,
            height: 18,
            background: 'rgba(255,255,255,0.1)',
            flexShrink: 0,
          }}
        />

        {/* One orb per theme */}
        {THEME_ORDER.map((t) => (
          <ThemeOrb
            key={t}
            themeKey={t}
            isActive={theme === t}
            isAnimating={isAnimating}
            onClick={handleSelect}
            orbRef={theme === t ? activeOrbRef : undefined}
          />
        ))}
      </div>
    </>
  );
}
