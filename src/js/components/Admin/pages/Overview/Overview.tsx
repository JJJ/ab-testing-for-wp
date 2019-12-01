// @flow

import React, { Fragment } from 'react';
import classNames from 'classnames';

import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';

import Table from '../../components/Table/Table';
import Significance from '../../../Significance/Significance';

import { decodeLink } from '../../../../helpers/wordpress';

import { i18n } from '../../../../wp';

import './Overview.css';

const { __ } = i18n;

type OverviewData = {
  activeTests: TestData[];
};

function postLink(name: string, link?: string, testId?: string) {
  const decodedLink = decodeLink(link);

  const url = [
    decodedLink,
    testId ? '&test=' : '',
    testId,
  ].join('');

  return link ? (<a href={url}>{name !== '' ? name : __('No Name')}</a>) : name;
}

function removeLink(link?: string) {
  return postLink(__('Remove'), link);
}

const toTestVariantResult = variant => ({
  id: variant.id,
  name: variant.name,
  participants: variant.participants,
  conversions: variant.conversions,
});

function Test(test: TestData) {
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
              )}
          />
        </td>
        <td className="column-primary">
          <div className="row-title">
            {postLink(test.title, test.postLink, test.id)}
          </div>
          <div className="row-actions">
            <span className="edit">
              {postLink(__('Edit'), test.postLink, test.id)}
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
        <td colSpan="6" style={{ display: 'table-cell', paddingTop: 0 }}>
          {test.totalParticipants > 0 ? (
            <Table className="variations">
              <thead>
                <tr>
                  <th className="check-column" />
                  <th className="column-primary">{__('Conversion Rate')}</th>
                  <th>{__('Conversions')}</th>
                  <th>{__('Participants')}</th>
                </tr>
              </thead>
              <tbody>
                {test.variants.map(variant => (
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
            <em>{__('No results for this test yet.')}</em>
          )}
          {test.totalParticipants > 0 && (
            <Significance
              control={test.control}
              results={test.variants.map(toTestVariantResult)}
            />
          )}
        </td>
      </tr>
    </Fragment>
  );
}

function Overview({ data }: { data: OverviewData }) {
  const { activeTests } = data;

  return (
    <div className="wrap ab-testing-for-wp">
      <h1 className="wp-heading-inline">{__('A/B Tests')}</h1>
      <a
        href="post-new.php?post_type=abt4wp-test"
        className="page-title-action"
      >
        {__('Add New')}
      </a>
      <hr className="wp-header-end" />

      {activeTests && activeTests.length > 0 ? (
        <Table className="running-tests">
          <thead>
            <tr>
              <th className="check-column" />
              <th className="column-primary">{__('Title')}</th>
              <th>{__('Started at')}</th>
              <th>{__('Page / Shortcode')}</th>
              <th>{__('Conversion Goal')}</th>
              <th className="num">{__('Participants')}</th>
            </tr>
          </thead>
          <tbody>{activeTests.map(Test)}</tbody>
        </Table>
      ) : (
        <Fragment>
          <h2>{__('No active tests found in content.')}</h2>
          <p>{__('Edit a page or post to add an A/B Test to the content.')}</p>
        </Fragment>
      )}
    </div>
  );
}

export default Overview;
