import handleTestRender from './frontend/handleTestRender';
import handleTestTracking from './frontend/handleTestTracking';

function onLoad(): void {
  handleTestRender();
  handleTestTracking();
}

document.addEventListener('DOMContentLoaded', onLoad);
