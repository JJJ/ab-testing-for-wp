import React from 'react';

type TableProps = {
  className: string;
};

const Table: React.FC<TableProps> = ({ className, children }) => (
  <table className={`${className} wp-list-table widefat fixed striped`}>
    {children}
  </table>
);

export default Table;
