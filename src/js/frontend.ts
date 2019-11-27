import handleTestRender from './frontend/handleTestRender';
import handleTestTracking from './frontend/handleTestTracking';

function onLoad() {
  handleTestRender();
  handleTestTracking();
}

document.addEventListener('DOMContentLoaded', onLoad);
