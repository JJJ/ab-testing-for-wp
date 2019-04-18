// @flow

export function decodeLink(link?: string = ''): string {
  const e = document.createElement('div');
  e.innerHTML = link;
  return e.textContent;
}
