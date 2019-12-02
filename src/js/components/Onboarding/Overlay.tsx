export function drawOverlayAround(
  target: HTMLElement,
  spacingTop = 0,
  spacingRight = 0,
  spacingBottom = 0,
  spacingLeft = 0,
): void {
  let overlay = document.getElementById('OverboardingOverlay');
  let preventClick = document.getElementById('OverboardingPreventClick');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.setAttribute('id', 'OverboardingOverlay');
    overlay.setAttribute('class', 'ab-testing-for-wp__OnboardingOverlay');

    if (!document.body) return;
    document.body.appendChild(overlay);
  }

  if (!preventClick) {
    preventClick = document.createElement('div');
    preventClick.setAttribute('id', 'OverboardingPreventClick');

    if (!document.body) return;
    document.body.appendChild(preventClick);
  }

  const boundingRects = target.getBoundingClientRect();

  const top = boundingRects.top - spacingTop;
  const left = boundingRects.left - spacingLeft;
  const right = boundingRects.right + spacingRight;
  const bottom = boundingRects.bottom + spacingBottom;

  overlay.style.clipPath = `polygon(0 0, 0 100%, ${left}px 100%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px 100%, 100% 100%, 100% 0%)`;
}

export function removeOverlay(): void {
  const overlay = document.getElementById('OverboardingOverlay');
  if (!overlay) return;
  const parent = overlay.parentNode;
  if (!parent) return;
  parent.removeChild(overlay);

  const preventClick = document.getElementById('OverboardingPreventClick');
  if (!preventClick) return;
  const preventClickParent = preventClick.parentNode;
  if (!preventClickParent) return;
  preventClickParent.removeChild(preventClick);
}
