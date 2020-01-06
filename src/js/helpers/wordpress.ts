export function decodeLink(link = ''): string {
  const e = document.createElement('div');
  e.innerHTML = link;
  return e.textContent || '';
}

export default {};
