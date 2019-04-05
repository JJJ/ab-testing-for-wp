// @flow @jsx wp.element.createElement

import classNames from 'classnames';

import calcTestWinner from '../../helpers/calcTestWinner';
import { i18n } from '../../wp';

const { __, sprintf } = i18n;

function getTranslationString(control, testResult) {
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

function Significance({ control, results }: SignificanceProps) {
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
        __(getTranslationString(control, testResult)),
        testResult.winner.name,
      )}
    </div>
  );
}

export default Significance;
