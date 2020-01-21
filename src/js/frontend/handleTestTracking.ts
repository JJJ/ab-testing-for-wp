import apiFetch from '@wordpress/api-fetch';

function handleTracking(
  getUrl: (target: EventTarget | null) => string | undefined,
): (e: Event) => void {
  return function trackingEventHandler(e): void {
    if (!navigator.sendBeacon) return;

    const url = getUrl(e.target);

    if (!url) return;

    navigator.sendBeacon('/ab-testing-for-wp/v1/outbound', JSON.stringify({ url }));
  };
}

function handleTestTracking(): void {
  // listen to anchor navigation
  window.addEventListener('click', handleTracking((target): string | undefined => {
    if (!target || !(target as HTMLAnchorElement).href) return undefined;
    return (target as HTMLAnchorElement).href;
  }));

  // listen to form submits
  window.addEventListener('submit', handleTracking((target): string | undefined => {
    if (!target || !(target as HTMLFormElement).action) return undefined;
    return (target as HTMLFormElement).action;
  }));

  // track every page
  if (!ABTestingForWP || !ABTestingForWP.postId) return;
  apiFetch({ path: `/ab-testing-for-wp/v1/track?post=${ABTestingForWP.postId}` });
}

export default handleTestTracking;
