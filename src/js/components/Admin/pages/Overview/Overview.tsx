import React, { Fragment } from 'react';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';

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

const Test: React.FC<{ test: TestData }> = ({ test }) => {
  const isSingle = test.postType === 'abt4wp-test';

  return (
    <Fragment key={test.id}>
      <tr>
        <td className="check-column check-column-normal">
          <div
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
        {test.startedAt > 0 ? (
          <td>
            <abbr title={`${format(test.startedAt, 'yyyy/MM/dd HH:mm')}`}>
              {format(test.startedAt, 'yyyy/MM/dd')}
            </abbr>
            {` (${formatDistance(new Date(), test.startedAt)})`}
          </td>
        ) : (
          <td>—</td>
        )}
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

const Overview: React.FC<{ data: OverviewData }> = ({ data: { activeTests } }) => (
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
        <tbody>{activeTests.map((test) => <Test test={test} />)}</tbody>
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
