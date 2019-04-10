// @flow

import React, { Fragment } from 'react';
import classNames from 'classnames';

import format from 'date-fns/format';
import distanceInWords from 'date-fns/distance_in_words';

import Table from '../../components/Table/Table';
import Significance from '../../../Significance/Significance';

import { i18n } from '../../../../wp';

import './Overview.css';

const { __ } = i18n;

type TestVariant = {
  id: string;
  conversions: number;
  participants: number;
  leading: boolean;
  name: string;
  rate: number;
  uplift: number;
}

type OverviewData = {
  activeTests: {
    id: string;
    control: string;
    title: string;
    goalName: string;
    goalType: string;
    goalLink?: string;
    postGoal: string;
    postName: string;
    postLink?: string;
    startedAt: number;
    totalParticipants: number;
    isArchived: string;
    isEnabled: boolean;
    variants: TestVariant[];
  }[];
};

function postLink(name: string, link?: string, testId?: string) {
  const e = document.createElement('div');
  e.innerHTML = link || '';
  const decodedLink = e.textContent;

  const url = [
    decodedLink,
    testId ? '&test=' : '',
    testId,
  ].join('');

  return link ? (<a href={url}>{name}</a>) : name;
}

const toTestVariantResult = variant => ({
  id: variant.id,
  name: variant.name,
  participants: variant.participants,
  conversions: variant.conversions,
});

function Overview({ data }: { data: OverviewData }) {
  const { activeTests } = data;

  return (
    <div className="wrap ab-testing-for-wp">
      <h1>{__('Active A/B Tests')}</h1>

      {activeTests && activeTests.length > 0 ? (
        <Table className="running-tests">
          <thead>
            <tr>
              <th className="check-column" />
              <th className="column-primary">{__('Title')}</th>
              <th>{__('Started At')}</th>
              <th>{__('On Page')}</th>
              <th>{__('Goal')}</th>
              <th className="num">{__('Participants')}</th>
            </tr>
          </thead>
          <tbody>
            {activeTests.map(test => (
              <Fragment>
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
                  <td className="column-primary">{postLink(test.title, test.postLink, test.id)}</td>
                  {test.startedAt > 0 ? (
                    <td>{`${format(test.startedAt, 'YYYY/MM/DD')} (${distanceInWords(test.startedAt, new Date())})`}</td>
                  ) : (
                    <td>—</td>
                  )}
                  <td>{postLink(test.postName, test.postLink, test.id)}</td>
                  <td>{postLink(test.goalName, test.goalLink)}</td>
                  <td className="num">{test.totalParticipants}</td>
                </tr>
                <tr />
                <tr style={{ display: 'table-row' }} id={`ABTestResults-${test.id}`}>
                  <td colSpan="6" style={{ display: 'table-cell' }}>
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
                      <p><em>{__('No results for this test yet.')}</em></p>
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
            ))}
          </tbody>
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
