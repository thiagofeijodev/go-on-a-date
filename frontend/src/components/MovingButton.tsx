import { useRef, useState, useLayoutEffect } from 'react';
import { safeRandomPos } from './movingButtonPos';

export default function MovingButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const dims   = useRef({ w: 0, h: 0 });
  const [escaped, setEscaped] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Measure once after the button is in the DOM and laid out.
  // useLayoutEffect fires synchronously after layout, before paint,
  // so getBoundingClientRect is always non-zero here.
  useLayoutEffect(() => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      dims.current = { w: r.width, h: r.height };
    }
  }, []);

  function dodge() {
    const { w, h } = dims.current;
    if (!w || !h) return;
    const p = safeRandomPos(w, h, window.innerWidth, window.innerHeight);
    setPos(p);
  }

  function handleMouseEnter() {
    if (!escaped) {
      setEscaped(true);
    }
    dodge();
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
