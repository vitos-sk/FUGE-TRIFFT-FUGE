let lockCount = 0;

export function lockScroll(): void {
  if (lockCount++ === 0) {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflowY = 'hidden';
  }
}

export function unlockScroll(): void {
  if (--lockCount <= 0) {
    lockCount = 0;
    document.body.style.overflow = '';
    document.documentElement.style.overflowY = '';
  }
}
