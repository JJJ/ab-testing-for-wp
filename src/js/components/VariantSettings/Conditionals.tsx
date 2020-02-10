import React from 'react';
import { __, sprintf } from '@wordpress/i18n';

import './Conditionals.css';

type ConditionalsProps = {
  variant: ABTestVariant;
};

const Conditionals: React.FC<ConditionalsProps> = ({ variant }) => (
  <div className="Conditionals">
    <button type="button" className="components-button is-link">
      {sprintf(__('Add condition for "%s"', 'ab-testing-for-wp'), variant.name)}
    </button>
  </div>
);

export default Conditionals;
