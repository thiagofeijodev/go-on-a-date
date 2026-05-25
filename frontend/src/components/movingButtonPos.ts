const MARGIN = 16;

export function safeRandomPos(
  btnW: number,
  btnH: number,
  vw: number,
  vh: number,
): { top: number; left: number } {
  const top  = MARGIN + Math.random() * Math.max(0, vh - btnH - MARGIN * 2);
  const left = MARGIN + Math.random() * Math.max(0, vw - btnW - MARGIN * 2);

  return {
    top:  Math.min(top,  vh - btnH - MARGIN),
    left: Math.min(left, vw - btnW - MARGIN),
  };
}
