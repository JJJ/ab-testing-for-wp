import React from 'react';

import queryString from 'query-string';

import Overview from './pages/Overview/Overview';

type AdminPageProps = {
  data?: AbTestingForWpData;
  reload: () => void;
}

function getPage(): string {
  const { page } = queryString.parse(window.location.search);

  if (!page || Array.isArray(page)) {
    return '';
  }

  return page.replace('ab-testing-for-wp_', '').replace('ab-testing-for-wp', '');
}

const AdminPage: React.FC<AdminPageProps> = ({ data, reload }) => {
  if (!data) return null;

  const page = getPage();

  switch (page) {
    case '':
      return <Overview data={data} reload={reload} />;
    default:
      throw new Error(`Component for ${page} can not be found`);
  }
};

export default AdminPage;
