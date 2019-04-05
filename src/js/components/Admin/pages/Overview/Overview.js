// @flow

import React, { Fragment } from 'react';

import Table from '../../components/Table/Table';

import { i18n } from '../../../../wp';

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
    goalName: string;
    goalType: string;
    goalLink?: string;
    postGoal: string;
    postName: string;
    postLink?: string;
    startedAt: string;
    totalParticipants: number;
    isArchived: string;
    isEnabled: boolean;
    variants: TestVariant[];
  }[];
};

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
              <th className="column-primary">{__('Started At')}</th>
              <th>{__('Page')}</th>
              <th>{__('Goal')}</th>
              <th className="num">{__('Participants')}</th>
            </tr>
          </thead>
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
