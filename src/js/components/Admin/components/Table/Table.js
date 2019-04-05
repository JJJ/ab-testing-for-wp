// @flow

import React from 'react';

type TableProps = {
  children: any;
  className: string;
};

function Table({ className, children }: TableProps) {
  return (
    <table className={`${className} wp-list-table widefat fixed striped`}>
      {children}
    </table>
  );
}

export default Table;
