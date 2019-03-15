// @flow @jsx wp.element.createElement

import { Component } from 'react';

import { apiFetch, components, i18n } from '../../WP';

const { __, sprintf } = i18n;
const { PanelBody } = components;

type TestResultsProps = {
  testId: string;
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
    const { results, loading } = this.state;

    return (
      <PanelBody title={__('Results so far')}>
        {!loading && (
          results.map(result => (
            <div>
              <div>{sprintf(__('Variation %s'), result.name)}</div>
              <p>
                {sprintf(
                  __('%d%% conversion (%d/%d)'),
                  Math.round((100 / result.participants) * result.conversions),
                  result.conversions,
                  result.participants,
                )}
              </p>
            </div>
          ))
        )}
      </PanelBody>
    );
  }
}

export default TestResults;
