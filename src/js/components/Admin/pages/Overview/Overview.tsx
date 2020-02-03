import React, { Fragment } from 'react';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';

import Table from '../../components/Table/Table';
import Significance from '../../../Significance/Significance';

import { decodeLink } from '../../../../helpers/wordpress';

import './Overview.css';

type OverviewData = {
  activeTests: TestData[];
};

function postLink(name: string, link?: string, testId?: string): React.ReactNode | string {
  const decodedLink = decodeLink(link);

  const url = [
    decodedLink,
    testId ? '&test=' : '',
    testId,
  ].join('');

  return link ? (<a href={url}>{name !== '' ? name : __('No Name', 'ab-testing-for-wp')}</a>) : name;
}

function removeLink(link?: string): React.ReactNode | null {
  return postLink(__('Remove', 'ab-testing-for-wp'), link);
}

function startTest(id: string, isEnabled: boolean, cb: () => void): void {
  apiFetch<TestData>({
    path: 'ab-testing-for-wp/v1/update-test',
    method: 'POST',
    data: { id, isEnabled },
  })
    .then((data) => {
      if (!ABTestingForWP_Data) return;

      ABTestingForWP_Data.activeTests = ABTestingForWP_Data.activeTests.map((t) => {
        if (t.id === data.id) return data;
        return t;
      });

      cb();
    });
}

const toTestVariantResult = (variant: TestVariant): {
  id: TestVariant['id'];
  name: TestVariant['name'];
  participants: TestVariant['participants'];
  conversions: TestVariant['conversions'];
} => ({
  id: variant.id,
  name: variant.name,
  participants: variant.participants,
  conversions: variant.conversions,
});

interface TestProps {
  test: TestData;
  reload: () => void;
}

const Test: React.FC<TestProps> = ({ test, reload }) => {
  const isSingle = test.postType === 'abt4wp-test';

  return (
    <Fragment key={test.id}>
      <tr>
        <td className="check-column check-column-normal">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            onClick={(): void => startTest(test.id, !test.isEnabled, reload)}
            className={
              classNames(
                'indicator',
                {
                  'indicator--on': test.isEnabled,
                  'indicator--off': !test.isEnabled,
                },
              )
            }
          />
        </td>
        <td className="column-primary">
          <div className="row-title">
            {postLink(test.title, test.postLink, test.id)}
          </div>
          <div className="row-actions">
            <span className="edit">
              {postLink(__('Edit', 'ab-testing-for-wp'), test.postLink, test.id)}
              {isSingle && ' | '}
            </span>
            {isSingle && (
              <span className="trash">
                {removeLink(test.postDeleteLink)}
              </span>
            )}
          </div>
        </td>
        <td>
          {test.startedAt > 0 ? (
            <div className="row-title">
              <abbr title={`${format(test.startedAt, 'yyyy/MM/dd HH:mm')}`}>
                {format(test.startedAt, 'yyyy/MM/dd')}
              </abbr>
              {` (${formatDistance(new Date(), test.startedAt)})`}
            </div>
          ) : (
            <div className="row-title">—</div>
          )}
          <div className="row-actions">
            {test.isEnabled && test.startedAt > 0 ? (
              <span className="trash">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" onClick={(): void => startTest(test.id, false, reload)}>
                  {__('Stop test', 'ab-testing-for-wp')}
                </a>
              </span>
            ) : (
              <span className="edit">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" onClick={(): void => startTest(test.id, true, reload)}>
                  {__('Run test', 'ab-testing-for-wp')}
                </a>
              </span>
            )}
          </div>
        </td>
        <td>
          {
            isSingle
              ? <code>{`[ab-test id=${test.postId}]`}</code>
              : postLink(test.postName, test.postLink, test.id)
          }
        </td>
        <td>{postLink(test.goalName, test.goalLink)}</td>
        <td className="num">{test.totalParticipants}</td>
      </tr>
      <tr />
      <tr style={{ display: 'table-row' }} id={`ABTestResults-${test.id}`}>
        <td colSpan={6} style={{ display: 'table-cell', paddingTop: 0 }}>
          {test.totalParticipants > 0 ? (
            <Table className="variations">
              <thead>
                <tr>
                  <th className="check-column">{}</th>
                  <th className="column-primary">{__('Conversion Rate', 'ab-testing-for-wp')}</th>
                  <th>{__('Conversions', 'ab-testing-for-wp')}</th>
                  <th>{__('Participants', 'ab-testing-for-wp')}</th>
                </tr>
              </thead>
              <tbody>
                {test.variants.map((variant) => (
                  <tr className={variant.leading && variant.participants > 0 ? 'ABTestWinning' : 'ABTestLosing'}>
                    <td className="check-column check-column-normal">
                      {variant.name}
                      {variant.id === test.control && ' *'}
                    </td>
                    <td className="column-primary">
                      {`${variant.rate}%`}
                      {variant.uplift !== 0 && (
                        <span className="ABTestUplift">
                          {[
                            ' (',
                            variant.uplift > 0 ? '+' : '',
                            variant.uplift,
                            '%)',
                          ].join('')}
                        </span>
                      )}
                    </td>
                    <td>{variant.conversions}</td>
                    <td>{variant.participants}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <em>{__('No results for this test yet.', 'ab-testing-for-wp')}</em>
          )}
          {test.totalParticipants > 0 && (
            <Significance
              control={test.control}
              results={test.variants.map((variant) => toTestVariantResult(variant))}
            />
          )}
        </td>
      </tr>
    </Fragment>
  );
};

interface OverviewProps {
  data: OverviewData;
  reload: () => void;
}

const Overview: React.FC<OverviewProps> = ({ data: { activeTests }, reload }) => (
  <div className="wrap ab-testing-for-wp">
    <h1 className="wp-heading-inline">{__('A/B Tests', 'ab-testing-for-wp')}</h1>
    <a
      href="post-new.php?post_type=abt4wp-test"
      className="page-title-action"
    >
      {__('Add New', 'ab-testing-for-wp')}
    </a>
    <hr className="wp-header-end" />

    {activeTests && activeTests.length > 0 ? (
      <Table className="running-tests">
        <thead>
          <tr>
            <th className="check-column">{}</th>
            <th className="column-primary">{__('Title', 'ab-testing-for-wp')}</th>
            <th>{__('Started at', 'ab-testing-for-wp')}</th>
            <th>{__('Page / Shortcode', 'ab-testing-for-wp')}</th>
            <th>{__('Conversion Goal', 'ab-testing-for-wp')}</th>
            <th className="num">{__('Participants', 'ab-testing-for-wp')}</th>
          </tr>
        </thead>
        <tbody>{activeTests.map((test) => <Test test={test} reload={reload} />)}</tbody>
      </Table>
    ) : (
      <>
        <h2>{__('No active tests found in content.', 'ab-testing-for-wp')}</h2>
        <p>{__('Edit a page or post to add an A/B Test to the content.', 'ab-testing-for-wp')}</p>
      </>
    )}
  </div>
);

export default Overview;
