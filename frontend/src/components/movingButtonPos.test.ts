import { describe, it, expect } from 'vitest';
import { safeRandomPos } from './movingButtonPos';

const MARGIN = 16;
const RUNS = 10_000;

describe('safeRandomPos', () => {
  it('never places the button below the viewport bottom', () => {
    const btnH = 48, btnW = 120, vw = 1280, vh = 800;
    for (let i = 0; i < RUNS; i++) {
      const { top } = safeRandomPos(btnW, btnH, vw, vh);
      expect(top + btnH).toBeLessThanOrEqual(vh - MARGIN);
    }
  });

  it('never places the button above the viewport top', () => {
    const btnH = 48, btnW = 120, vw = 1280, vh = 800;
    for (let i = 0; i < RUNS; i++) {
      const { top } = safeRandomPos(btnW, btnH, vw, vh);
      expect(top).toBeGreaterThanOrEqual(MARGIN);
    }
  });

  it('never places the button past the right edge', () => {
    const btnH = 48, btnW = 120, vw = 1280, vh = 800;
    for (let i = 0; i < RUNS; i++) {
      const { left } = safeRandomPos(btnW, btnH, vw, vh);
      expect(left + btnW).toBeLessThanOrEqual(vw - MARGIN);
    }
  });

  it('never places the button past the left edge', () => {
    const btnH = 48, btnW = 120, vw = 1280, vh = 800;
    for (let i = 0; i < RUNS; i++) {
      const { left } = safeRandomPos(btnW, btnH, vw, vh);
      expect(left).toBeGreaterThanOrEqual(MARGIN);
    }
  });

  it('stays in bounds on a small viewport where button nearly fills the screen', () => {
    const btnH = 48, btnW = 120, vw = 200, vh = 100;
    for (let i = 0; i < RUNS; i++) {
      const { top, left } = safeRandomPos(btnW, btnH, vw, vh);
      expect(top).toBeGreaterThanOrEqual(MARGIN);
      expect(top + btnH).toBeLessThanOrEqual(vh - MARGIN);
      expect(left).toBeGreaterThanOrEqual(MARGIN);
      expect(left + btnW).toBeLessThanOrEqual(vw - MARGIN);
    }
  });
});
