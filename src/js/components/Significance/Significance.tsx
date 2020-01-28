import React from 'react';
import { __, sprintf } from '@wordpress/i18n';

import classNames from 'classnames';

import calcTestWinner, { TestWinner } from '../../helpers/calcTestWinner';

import './Significance.css';

function getTranslationString(control: string, testResult: TestWinner): string {
  if (!testResult.confident) {
    return 'Test results for are NOT significant enough to declare a winner yet.';
  }

  return testResult.winner.id !== control
    ? 'Test results are significant enough to declare variation %s the winner with 95%% confidence.'
    : 'Test results are significant enough to say control variation %s remains a winner with 95%% confidence.';
}

type SignificanceProps = {
  control: string;
  results: ABTestResult[];
};

const Significance: React.FC<SignificanceProps> = ({ control, results }) => {
  const testResult = calcTestWinner(control, results);

  if (!testResult) return null;

  return (
    <div
      className={classNames(
        'Significance',
        {
          'Significance--success': testResult.confident && testResult.winner.id !== control,
          'Significance--failed': testResult.confident && testResult.winner.id === control,
        },
      )}
    >
      {sprintf(
        __(getTranslationString(control, testResult), 'ab-testing-for-wp'),
        testResult.winner.name,
      )}
    </div>
  );
};

export default Significance;
