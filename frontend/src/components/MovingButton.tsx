import { useRef, useState } from 'react';

export default function MovingButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: '60%', left: '62%' });

  function dodge() {
    const btn = btnRef.current;
    if (!btn) return;
    const w = btn.offsetWidth + 16;
    const h = btn.offsetHeight + 16;
    const maxX = window.innerWidth - w;
    const maxY = window.innerHeight - h;
    const newLeft = Math.max(8, Math.random() * maxX);
    const newTop = Math.max(8, Math.random() * maxY);
    setPos({ top: `${newTop}px`, left: `${newLeft}px` });
  }

  return (
    <button
      ref={btnRef}
      onMouseEnter={dodge}
      onTouchStart={(e) => { e.preventDefault(); dodge(); }}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        transition: 'top 0.15s ease, left 0.15s ease',
        zIndex: 50,
      }}
      className="px-8 py-3 rounded-full border-2 border-rose-300 text-rose-400 font-semibold text-lg bg-white/80 backdrop-blur-sm shadow cursor-default select-none"
      tabIndex={-1}
      aria-hidden="true"
    >
      No
    </button>
  );
}
