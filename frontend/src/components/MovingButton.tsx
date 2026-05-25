import { useRef, useState } from 'react';

export default function MovingButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [escaped, setEscaped] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  function randomPos() {
    const btn = btnRef.current;
    if (!btn) return null;
    const margin = 12;
    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;
    // top is clamped so top >= margin and top + btnH <= innerHeight - margin
    const maxTop = Math.max(0, window.innerHeight - btnH - margin);
    const maxLeft = Math.max(0, window.innerWidth - btnW - margin);
    return {
      top: margin + Math.random() * (maxTop - margin),
      left: margin + Math.random() * (maxLeft - margin),
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
