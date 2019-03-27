// @flow @jsx wp.element.createElement

import { Component } from 'react';
import classNames from 'classnames';

import { apiFetch, components, i18n } from '../../WP';

import './TestResults.css';

const { __ } = i18n;
const { PanelBody } = components;

type TestResultsProps = {
  testId: string;
  isEnabled: boolean;
};

type TestResultsState = {
  loading: boolean;
  results: {
    id: string;
    name: string;
    participants: number;
    conversions: number;
  }[];
};

class TestResults extends Component<TestResultsProps, TestResultsState> {
  state = {
    loading: true,
    results: [],
  };

  componentDidMount() {
    const { testId } = this.props;

    apiFetch({ path: `/ab-testing-for-wp/v1/stats?test=${testId}` })
      .then((results) => {
        this.setState({
          results: results.map(result => ({
            ...result,
            participants: parseInt(result.participants, 10),
            conversions: parseInt(result.conversions, 10),
          })),
          loading: false,
        });
      });
  }

  render() {
    const { isEnabled } = this.props;
    const { results, loading } = this.state;

    const hasParticipants = results.reduce((acc, b) => acc + b.participants, 0) > 0;

    if (loading || (!isEnabled && !hasParticipants)) {
      return null;
    }

    const enrichedResults = results
      .map(result => ({
        ...result,
        rate: result.participants === 0
          ? 0
          : Math.round((100 / result.participants) * result.conversions),
        winner: !results
          .every(variant => result.participants / result.conversions
            >= variant.participants / variant.conversions),
      }));

    return (
      <PanelBody title={__('Results so far')}>
        {hasParticipants ? (
          <table className="TestResults">
            <tbody>
              <tr>
                <td className="TestResultName">{__('Variation')}</td>
                {enrichedResults.map(result => (
                  <td
                    className={classNames(result.winner ? 'TestResultWinner' : 'TestResultLoser', 'TestResultValue')}
                    key={result.id}
                  >
                    {result.name}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="TestResultName">{__('Conversion Rate')}</td>
                {enrichedResults.map(result => (
                  <td
                    className={classNames(result.winner ? 'TestResultWinner' : 'TestResultLoser', 'TestResultValue')}
                    key={result.id}
                  >
                    {result.rate}
                    %
                  </td>
                ))}
              </tr>
              <tr>
                <td className="TestResultName">{__('Conversions')}</td>
                {enrichedResults.map(result => (
                  <td className="TestResultValue" key={result.id}>{result.conversions}</td>
                ))}
              </tr>
              <tr>
                <td className="TestResultName">{__('Participants')}</td>
                {enrichedResults.map(result => (
                  <td className="TestResultValue" key={result.id}>{result.participants}</td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <div>No participants yet.</div>
        )}
      </PanelBody>
    );
  }
}

export default TestResults;
