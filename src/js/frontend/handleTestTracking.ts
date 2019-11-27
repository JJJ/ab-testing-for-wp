const { apiFetch } = window.wp;

function handleTestTracking() {
  if (!ABTestingForWP || !ABTestingForWP.postId) return;
  apiFetch({ path: `/ab-testing-for-wp/v1/track?post=${ABTestingForWP.postId}` });
}

export default handleTestTracking;
