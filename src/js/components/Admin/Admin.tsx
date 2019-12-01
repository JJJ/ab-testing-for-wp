import React from 'react';

import queryString from 'query-string';

import Overview from './pages/Overview/Overview';

type AdminPageProps = {
  data?: any;
}

function getPage(): string {
  const { page } = queryString.parse(window.location.search);

  if (!page || Array.isArray(page)) {
    return '';
  }

  return page.replace('ab-testing-for-wp_', '').replace('ab-testing-for-wp', '');
}

const AdminPage: React.FC<AdminPageProps> = ({ data }) => {
  if (!data) return null;

  const page = getPage();

  if (page) {
    throw new Error(`Component for ${page} can not be found`);
  }

  return <Overview data={data} />;
};

export default AdminPage;
