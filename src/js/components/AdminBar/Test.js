// @flow

import React from 'react';
import classNames from 'classnames';

function Test({ id, title, isEnabled, variants }: TestData) {
  const { cookieData } = window.ABTestingForWP_AdminBar || { cookieData: {} };

  return (
    <li
      className={classNames(
        'menupop ab-testing-for-wp__test',
        { 'ab-testing-for-wp__enabled': isEnabled },
      )}
    >
      <div className="ab-item ab-empty-item" aria-haspopup="true">
        <span>{title}</span>
      </div>
      <div className="ab-sub-wrapper">
        <ul className="ab-submenu">
          {variants.map(variant => (
            <li
              className={classNames(
                'ab-testing-for-wp__variant',
                { 'ab-testing-for-wp__selected': cookieData && cookieData[id] === variant.id },
              )}
            >
              <div className="ab-item ab-empty-item">{variant.name}</div>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default Test;
