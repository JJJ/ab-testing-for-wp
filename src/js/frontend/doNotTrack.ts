export default function doNotTrack(): boolean {
  return !!(ABTestingForWP && ABTestingForWP.notAdmin && navigator.doNotTrack);
}
