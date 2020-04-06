export default function doNotTrack(): boolean {
  const dnt = window.doNotTrack === '1' || navigator.doNotTrack === 'yes' || navigator.doNotTrack === '1';
  return !!(ABTestingForWP && ABTestingForWP.notAdmin && dnt);
}
