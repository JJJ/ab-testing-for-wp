// @flow

import React from 'react';

import queryString from 'query-string';

import Overview from './pages/Overview/Overview';

type AdminPageProps = {
  data?: any;
}

function getPage() {
  const { page } = queryString.parse(window.location.search);
  return page.replace('ab-testing-for-wp_', '').replace('ab-testing-for-wp', '');
}

function AdminPage({ data }: AdminPageProps) {
  const page = getPage();

  switch (page) {
    case 'new':
      return <Overview data={data} />;
    default:
      throw new Error(`Component for ${page} can not be found`);
  }
}

export default AdminPage;
