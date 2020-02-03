import React, { Component } from 'react';
import classNames from 'classnames';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { __, sprintf } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

import Significance from '../Significance/Significance';
import DeclareWinner from './DeclareWinner';

import './TestResults.css';

type TestResultsProps = {
  testId: string;
  control: string;
  isEnabled: boolean;
  startedAt: Date | number;
  onDeclareWinner: (id: string) => void;
};

type TestResultsState = {
  loading: boolean;
  results: ABTestResult[];
};

class TestResults extends Component<TestResultsProps, TestResultsState> {
  constructor(props: TestResultsProps) {
    super(props);

    this.state = {
      loading: true,
      results: [],
    };
  }

  componentDidMount(): void {
    const { testId } = this.props;

    apiFetch<ABTestResult[]>({ path: `ab-testing-for-wp/v1/stats?test=${testId}` })
      .then((results) => {
        this.setState({
          results: results.map((result) => ({
            ...result,
            participants: parseInt(result.participants.toString(), 10),
            conversions: parseInt(result.conversions.toString(), 10),
          })),
          loading: false,
        });
      });
  }

  render(): React.ReactElement | null {
    const {
      control,
      isEnabled,
      startedAt,
      onDeclareWinner,
    } = this.props;
    const { results, loading } = this.state;

    const hasParticipants = results.reduce((acc, b) => acc + b.participants, 0) > 0;

    if (loading || (!isEnabled && !hasParticipants)) {
      return null;
    }

    const controlVariant = results.find((result) => result.id === control);

    let crc = 0;
    if (controlVariant && controlVariant.participants > 0) {
      crc = controlVariant.conversions / controlVariant.participants;
    }

    const enrichedResults = results
      .map((result) => ({
        ...result,
        control: control === result.id,
        rate: result.participants === 0
          ? 0
          : Math.round((100 / result.participants) * result.conversions),
        uplift: Math.round(
          crc === 0 ? 0 : ((result.conversions / result.participants - crc) / crc) * 1000,
        ) / 10,
        winner: result.participants > 0 && !results
          .every((variant) => result.participants / result.conversions
            >= variant.participants / variant.conversions),
      }))
      .sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name > b.name) return -1;
        return 0;
      });

    return (
      <PanelBody title={__('Results so far', 'ab-testing-for-wp')}>
        {startedAt && <p>{sprintf(__('Runtime: %s', 'ab-testing-for-wp'), formatDistanceToNow(startedAt))}</p>}
        {hasParticipants ? (
          <table className="TestResults">
            <tbody>
              <tr>
                <td className="TestResultName">{__('Variation', 'ab-testing-for-wp')}</td>
                {enrichedResults.map((result) => (
                  <td
                    className={classNames(
                      {
                        TestResultWinner: result.winner,
                        TestResultLoser: !result.winner,
                        TestResultControl: result.control,
                      },
                      'TestResultValue',
                      'TestResultVariationName',
                    )}
                    key={result.id}
                  >
                    {result.name}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="TestResultName">{__('Conversion Rate', 'ab-testing-for-wp')}</td>
                {enrichedResults.map((result) => (
                  <td
                    className={classNames(
                      {
                        TestResultWinner: result.winner,
                        TestResultLoser: !result.winner,
                        TestResultControl: result.control,
                      },
                      'TestResultValue',
                    )}
                    key={result.id}
                  >
                    {result.rate}
                    %

                    {result.uplift !== 0 && (
                      <span className="TestResultDifference">
                        {`${result.uplift > 0 ? '+' : ''}${result.uplift}%`}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="TestResultName">{__('Conversions', 'ab-testing-for-wp')}</td>
                {enrichedResults.map((result) => (
                  <td className="TestResultValue" key={result.id}>{result.conversions}</td>
                ))}
              </tr>
              <tr>
                <td className="TestResultName">{__('Participants', 'ab-testing-for-wp')}</td>
                {enrichedResults.map((result) => (
                  <td className="TestResultValue" key={result.id}>{result.participants}</td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="TestResults"><em>{__('No participants yet.', 'ab-testing-for-wp')}</em></div>
        )}
        <Significance control={control} results={results} />
        <DeclareWinner variants={enrichedResults} onDeclareWinner={onDeclareWinner} />
      </PanelBody>
    );
  }
}

export default TestResults;
