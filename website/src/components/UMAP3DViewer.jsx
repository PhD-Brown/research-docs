import React from 'react';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

const VIEWS = [
  {
    id: 'classes',
    label: 'Spectral types',
    src: '/img/dimred/umap3d_classes.html',
    color: '#38BDF8',
    icon: '★',
    desc: 'Harvard sequence A→M — spontaneous unsupervised emergence',
    highlight: 'The Harvard sequence organizes itself into a continuous spiral in 3D space',
  },
  {
    id: 'teff',
    label: 'T_eff (K)',
    src: '/img/dimred/umap3d_teff.html',
    color: '#F59E0B',
    icon: '🌡',
    desc: 'Effective-temperature gradient — validation of the thermal axis',
    highlight: 'ρ(UMAP ax.1, Teff) = +0.464 — continuous gradient along the main structure',
  },
  {
    id: 'feh',
    label: '[Fe/H]',
    src: '/img/dimred/umap3d_feh.html',
    color: '#A78BFA',
    icon: 'Fe',
    desc: 'Metallicity gradient — validation of the chemical-composition axis',
    highlight: 'Readable [Fe/H] gradient perpendicular to the thermal axis',
  },
];

export default function UMAP3DViewer() {
  const [active, setActive] = React.useState('classes');
  const [loaded, setLoaded] = React.useState({});
  const { withBaseUrl } = useBaseUrlUtils();

  const current = VIEWS.find((v) => v.id === active);

  function handleTabClick(id) {
    setActive(id);
  }

  return (
    <div style={{ margin: '28px 0' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            opacity: 0.4,
            color: 'var(--ifm-font-color-base)',
          }}>
            Interactive 3D visualization — Plotly · LAMOST DR5 × Gaia DR3 · N = 43,019
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '10px',
          opacity: 0.4,
          color: 'var(--ifm-font-color-base)',
          fontFamily: 'monospace',
        }}>
          <span>🖱 Rotate · Scroll to zoom · Double-click to reset</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '0',
        flexWrap: 'wrap',
      }}>
        {VIEWS.map((v) => {
          const isActive = active === v.id;
          return (
            <button
              key={v.id}
              onClick={() => handleTabClick(v.id)}
              style={{
                background: isActive ? `${v.color}14` : 'transparent',
                border: 'none',
                borderBottom: `3px solid ${isActive ? v.color : 'transparent'}`,
                padding: '10px 18px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                borderRadius: '6px 6px 0 0',
                marginBottom: '-1px',
              }}
            >
              <span style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: '700',
                color: v.color,
                opacity: isActive ? 1 : 0.5,
              }}>{v.icon}</span>
              <span style={{
                fontSize: '13px',
                fontWeight: isActive ? '700' : '400',
                color: isActive ? v.color : 'var(--ifm-font-color-base)',
                opacity: isActive ? 1 : 0.55,
              }}>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* iframe panel */}
      <div style={{
        background: '#06080f',
        border: `1px solid ${current.color}30`,
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Loading overlay */}
        {!loaded[active] && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#06080f',
            zIndex: 10,
            gap: '12px',
          }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '28px',
              color: current.color,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}>◎</div>
            <div style={{
              fontSize: '12px',
              color: 'var(--ifm-font-color-base)',
              opacity: 0.5,
            }}>
              Loading interactive 3D graph…
            </div>
            <div style={{
              fontSize: '10px',
              color: 'var(--ifm-font-color-base)',
              opacity: 0.3,
              fontFamily: 'monospace',
            }}>
              43,019 points · Plotly.js
            </div>
          </div>
        )}

        {/* Render all iframes but hide inactive ones - avoids reload on tab switch */}
        {VIEWS.map((v) => (
          <iframe
            key={v.id}
            src={withBaseUrl(v.src)}
            title={`UMAP 3D — ${v.label}`}
            onLoad={() => setLoaded((prev) => ({ ...prev, [v.id]: true }))}
            style={{
              display: v.id === active ? 'block' : 'none',
              width: '100%',
              height: '560px',
              border: 'none',
              opacity: loaded[v.id] ? 1 : 0,
              transition: 'opacity 0.4s',
            }}
          />
        ))}
      </div>

      {/* Highlight bar */}
      <div style={{
        marginTop: '10px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 16px',
        background: `${current.color}08`,
        border: `1px solid ${current.color}25`,
        borderLeft: `4px solid ${current.color}`,
        borderRadius: '0 8px 8px 0',
        transition: 'all 0.2s',
      }}>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '16px',
          color: current.color,
          flexShrink: 0,
          marginTop: '1px',
        }}>→</div>
        <div>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: current.color,
            marginBottom: '3px',
          }}>
            {current.highlight}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--ifm-font-color-base)',
            opacity: 0.6,
            lineHeight: 1.5,
          }}>
            {current.desc}
          </div>
        </div>
      </div>

      {/* Three-view summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginTop: '12px',
      }}>
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => handleTabClick(v.id)}
            style={{
              background: active === v.id ? `${v.color}10` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${active === v.id ? v.color + '44' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '8px',
              padding: '10px 12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.13s',
            }}
          >
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: v.color,
              marginBottom: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{v.icon}</span>
              {v.label}
            </div>
            <div style={{
              fontSize: '10.5px',
              color: 'var(--ifm-font-color-base)',
              opacity: 0.5,
              lineHeight: 1.4,
            }}>
              {v.desc.split(' — ')[0]}
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
