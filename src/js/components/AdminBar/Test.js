// @flow

import React from 'react';
import classNames from 'classnames';
import scrollIntoView from 'scroll-into-view';

import highlightElement from './helpers/highlight';

import Variant from './Variant';

type TestProps = {
  pickedVariants: {
    [testId: string]: string;
  };
  onChangeVariant: (testId: string, variantId: string) => void;
} & TestData;

function findTestElementById(id: string) {
  return document.querySelector(`.ABTestWrapper[data-test=${id}]`);
}

function Test({
  id,
  title,
  isEnabled,
  variants,
  pickedVariants,
  onChangeVariant,
}: TestProps) {
  const onHover = () => {
    const element = findTestElementById(id);
    if (!element) return;

    scrollIntoView(element);
    highlightElement(id, element);
  };

  return (
    <li
      className={classNames(
        'menupop ab-testing-for-wp__test',
        { 'ab-testing-for-wp__enabled': isEnabled },
      )}
      onMouseOver={onHover}
      onFocus={onHover}
    >
      <div className="ab-item ab-empty-item" aria-haspopup="true">
        <span>{title}</span>
      </div>
      <div className="ab-sub-wrapper">
        <ul className="ab-submenu">
          {variants.map(variant => (
            <Variant
              {...variant}
              onChangeVariant={(variantId: string) => onChangeVariant(id, variantId)}
              isSelected={pickedVariants[id] === variant.id}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}

export default Test;
