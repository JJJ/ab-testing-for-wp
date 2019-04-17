// @flow

import React, { Fragment, Component } from 'react';
import queryString from 'query-string';

import { i18n, apiFetch } from '../../wp';

import Test from './Test';

const { __, sprintf } = i18n;

type AdminBarState = {
  isLoading: boolean;
  tests: TestData[];
  pickedVariants: {
    [testId: string]: string;
  };
};

class AdminBar extends Component<*, AdminBarState> {
  state = {
    isLoading: true,
    tests: [],
    pickedVariants: window.ABTestingForWP_AdminBar.cookieData || {},
  };

  componentDidMount() {
    const testsOnPage = document.querySelectorAll('.ABTestWrapper[data-test]');
    const testIds = [];
    testsOnPage.forEach(test => testIds.push(test.getAttribute('data-test')));

    apiFetch({ path: `/ab-testing-for-wp/v1/get-tests-info?${queryString.stringify({ id: testIds })}` })
      .then(tests => this.setState({ tests, isLoading: false }));
  }

  onChangeVariant = (testId: string, variantId: string) => {
    const { pickedVariants } = this.state;

    this.setState({
      pickedVariants: {
        ...pickedVariants,
        [testId]: variantId,
      },
    });

    apiFetch({ path: `/ab-testing-for-wp/v1/ab-test?test=${testId}&variant=${variantId}` })
      .then((result) => {
        if (result.html) {
          const target = document.querySelector(`.ABTestWrapper[data-test=${testId}]`);

          if (target) target.innerHTML = result.html;
        }
      });
  };

  render() {
    const { isLoading, tests, pickedVariants } = this.state;

    return (
      <Fragment>
        <div
          className="ab-item ab-empty-item"
          aria-haspopup="true"
        >
          {sprintf(__('A/B Tests %s'), tests.length > 0 ? `(${tests.length})` : '')}
        </div>
        <div className="ab-sub-wrapper">
          <ul id="wp-admin-bar-ab-testing-for-wp-default" className="ab-submenu">
            {isLoading && (
              <li>
                <div className="ab-item ab-empty-item" aria-haspopup="true">
                  {__('Scanning for tests on page')}
                </div>
              </li>
            )}
            {!isLoading && tests.length === 0
              ? (
                <li>
                  <div className="ab-item ab-empty-item" aria-haspopup="true">
                    {__('No tests found on page')}
                  </div>
                </li>
              )
              : tests.map(test => (
                <Test
                  {...test}
                  pickedVariants={pickedVariants}
                  onChangeVariant={this.onChangeVariant}
                />
              ))}
          </ul>
        </div>
      </Fragment>
    );
  }
}

export default AdminBar;
