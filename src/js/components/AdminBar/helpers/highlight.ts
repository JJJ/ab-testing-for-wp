let lastHighlighted: string;

function offsetFromRects(rect: DOMRect): { top: number; left: number } {
  const scrollLeft = window.pageXOffset
    || (document.documentElement || { scrollLeft: 0 }).scrollLeft;
  const scrollTop = window.pageYOffset
    || (document.documentElement || { scrollTop: 0 }).scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

export default function highlightElement(testId: string, node: HTMLElement): void {
  if (lastHighlighted === testId) return;

  lastHighlighted = testId;

  const highLightId = `ab-testing-for-wp__highlight__${testId}`;

  if (document.getElementById(highLightId)) return;

  document.querySelectorAll('.ab-testing-for-wp__highlight').forEach((item) => {
    if (!document.body) return;
    document.body.removeChild(item);
  });

  const boundingRects = node.getBoundingClientRect();
  const offset = offsetFromRects(boundingRects);
  const highlight = document.createElement('div');
  const padding = 15;

  highlight.className = 'ab-testing-for-wp__highlight';
  highlight.setAttribute('id', highLightId);

  highlight.style.position = 'absolute';
  highlight.style.width = `${boundingRects.width + (padding * 2)}px`;
  highlight.style.height = `${boundingRects.height + (padding * 2)}px`;
  highlight.style.top = `${offset.top - padding}px`;
  highlight.style.left = `${offset.left - padding}px`;

  if (!document.body) return;

  document.body.appendChild(highlight);

  setTimeout(() => {
    if (!document.body || !document.body.contains(highlight)) return;
    document.body.removeChild(highlight);
  }, 5000);
}
