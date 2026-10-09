// basis points: 10000 bps = 100%
export function applyBps(cents, bps) {
  return Math.round((cents * bps) / 10000);
}
