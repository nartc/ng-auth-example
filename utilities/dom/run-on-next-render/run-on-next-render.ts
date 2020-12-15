export function runOnNextRender(cb: () => void): void {
  setTimeout(() => {
    cb();
  });
}
