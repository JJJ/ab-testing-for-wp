import React, { Component, ReactNode } from 'react';
import queryString from 'query-string';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

import Test from './Test';

type AdminBarState = {
  isLoading: boolean;
  tests: TestData[];
  pickedVariants: {
    [testId: string]: string;
  };
};

class AdminBar extends Component<{}, AdminBarState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isLoading: true,
      tests: [],
      pickedVariants: ABTestingForWP_AdminBar.participating || {},
    };
  }

  componentDidMount(): void {
    const testsOnPage = document.querySelectorAll<HTMLElement>('.ABTestWrapper[data-test]');

    const sortedTestsOnPage = Array.from(testsOnPage).sort((a, b) => {
      if (a.offsetTop > b.offsetTop) {
        return 1;
      }

      if (a.offsetTop < b.offsetTop) {
        return -1;
      }

      return 0;
    });

    const testIds = sortedTestsOnPage.map((test) => test.getAttribute('data-test'));

    const resolveTestData = testIds.length > 0
      ? apiFetch<TestData[]>({ path: `ab-testing-for-wp/v1/get-tests-info?${queryString.stringify({ id: testIds }, { arrayFormat: 'bracket' })}` })
      : Promise.resolve([]);

    resolveTestData.then((tests) => {
      this.setState({
        tests: testIds
          .map((id) => tests.find((test) => test.id === id))
          .filter((test): boolean => typeof test !== 'undefined') as TestData[],
        isLoading: false,
      });
    });
  }

  onChangeVariant = (testId: string, variantId: string): void => {
    const { pickedVariants } = this.state;

    this.setState({
      pickedVariants: {
        ...pickedVariants,
        [testId]: variantId,
      },
    });

    apiFetch<{ html: string }>({ path: `ab-testing-for-wp/v1/ab-test?test=${testId}&variant=${variantId}` })
      .then((result) => {
        if (result.html) {
          const target = document.querySelector(`.ABTestWrapper[data-test="${testId}"]`);

          if (target) target.innerHTML = result.html;
        }
      });
  };

  render(): ReactNode {
    const { isLoading, tests, pickedVariants } = this.state;

    return (
      <>
        <div
          className="ab-item ab-empty-item"
          aria-haspopup="true"
        >
          {sprintf(__('A/B Tests %s', 'ab-testing-for-wp'), tests.length > 0 ? `(${tests.length})` : '')}
        </div>
        <div className="ab-sub-wrapper">
          <ul id="wp-admin-bar-ab-testing-for-wp-default" className="ab-submenu">
            {isLoading && (
              <li>
                <div className="ab-item ab-empty-item" aria-haspopup="true">
                  {__('Scanning for tests on page', 'ab-testing-for-wp')}
                </div>
              </li>
            )}
            {!isLoading && tests.length === 0
              ? (
                <li>
                  <div className="ab-item ab-empty-item" aria-haspopup="true">
                    {__('No tests found on page', 'ab-testing-for-wp')}
                  </div>
                </li>
              )
              : tests.map((test) => (
                <Test
                  {...test}
                  pickedVariants={pickedVariants}
                  onChangeVariant={this.onChangeVariant}
                />
              ))}
          </ul>
        </div>
      </>
    );
  }
}

export default AdminBar;
