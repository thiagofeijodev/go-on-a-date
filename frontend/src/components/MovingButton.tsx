import { useRef, useState } from 'react';

export default function MovingButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [escaped, setEscaped] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  function randomPos() {
    const btn = btnRef.current;
    if (!btn) return null;

    const margin = 16;
    // getBoundingClientRect gives the real rendered size regardless of position type
    const { width: btnW, height: btnH } = btn.getBoundingClientRect();
    // Fall back to offsetWidth/Height if rect is zero (before first paint)
    const w = btnW || btn.offsetWidth;
    const h = btnH || btn.offsetHeight;

    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const top  = margin + Math.random() * Math.max(0, vh - h - margin * 2);
    const left = margin + Math.random() * Math.max(0, vw - w - margin * 2);

    // Hard clamp so the bottom/right edges can never exceed the viewport
    return {
      top:  Math.min(top,  vh - h - margin),
      left: Math.min(left, vw - w - margin),
    };
  }

  function dodge() {
    const p = randomPos();
    if (p) setPos(p);
  }

  function handleMouseEnter() {
    if (!escaped) {
      const p = randomPos();
      if (!p) return;
      setEscaped(true);
      setPos(p);
    } else {
      dodge();
    }
  }

  return (
    <button
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onTouchStart={(e) => { e.preventDefault(); handleMouseEnter(); }}
      style={escaped ? {
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        transition: 'top 0.15s ease, left 0.15s ease',
        zIndex: 50,
      } : undefined}
      className="px-8 py-3 rounded-full border-2 border-rose-300 text-rose-400 font-semibold text-lg bg-white/80 backdrop-blur-sm shadow cursor-default select-none"
      tabIndex={-1}
      aria-hidden="true"
    >
      No
    </button>
  );
}
