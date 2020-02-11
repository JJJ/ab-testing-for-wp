import React, { Component } from 'react';
import { __, sprintf } from '@wordpress/i18n';

import './Conditionals.css';
import {
  SelectControl, TextControl, Button, IconButton,
} from '@wordpress/components';

interface ConditionalsProps {
  variant: ABTestVariant;
  onAddCondition: (id: string, key: string, value: string) => void;
  onRemoveCondition: (id: string, key: string, value: string) => void;
}

interface ConditionalsState {
  isOpened: boolean;
  showErrors: boolean;
  newConditionType: number;
  newConditionKey: string;
  newConditionValue: string;
}

const defaultState: ConditionalsState = {
  isOpened: false,
  showErrors: false,
  newConditionType: 0,
  newConditionKey: __('key', 'ab-testing-for-wp'),
  newConditionValue: __('value', 'ab-testing-for-wp'),
};

class Conditionals extends Component<ConditionalsProps, ConditionalsState> {
  constructor(props: ConditionalsProps) {
    super(props);

    this.state = defaultState;
  }

  setOpened(isOpened: boolean): void {
    this.setState({ isOpened });
  }

  setNewConditionType(conditionType: string): void {
    let newConditionKey = '';
    const newConditionType = parseInt(conditionType, 10);

    switch (newConditionType) {
      case 1:
        newConditionKey = 'utm_source';
        break;
      case 2:
        newConditionKey = 'utm_medium';
        break;
      case 3:
        newConditionKey = 'utm_campaign';
        break;
      default:
        newConditionKey = __('key', 'ab-testing-for-wp');
    }

    this.setState({ newConditionType, newConditionKey });
  }

  setNewConditionKey(newConditionKey: string): void {
    this.setState({ newConditionKey });
  }

  setNewConditionValue(newConditionValue: string): void {
    this.setState({ newConditionValue });
  }

  cancelNew(): void {
    this.setState(defaultState);
  }

  addCondition(): void {
    const { variant, onAddCondition } = this.props;
    const { newConditionKey, newConditionValue } = this.state;

    if (newConditionKey.trim() === '' || newConditionValue.trim() === '') {
      this.setState({
        showErrors: true,
      });
      return;
    }

    onAddCondition(variant.id, newConditionKey, newConditionValue);

    this.setState(defaultState);
  }

  removeCondition(condition: { key: string; value: string }): void {
    const { variant, onRemoveCondition } = this.props;

    onRemoveCondition(variant.id, condition.key, condition.value);
  }

  render(): React.ReactElement {
    const { variant } = this.props;
    const {
      newConditionType,
      newConditionKey,
      newConditionValue,
      isOpened,
      showErrors,
    } = this.state;

    return (
      <div className="Conditionals">
        {variant.conditions && variant.conditions.length > 0 && (
          <div className="Conditionals__ListContainer">
            <div className="components-base-control__label">
              {sprintf(__('Force variant %s when either', 'ab-testing-for-wp'), variant.name)}
            </div>
            <div className="Conditionals__List">
              {variant.conditions.map((condition) => (
                <code key={[condition.key, condition.value].join('=')}>
                  <span>{`${condition.key}=${condition.value}`}</span>
                  <IconButton
                    isSmall
                    isLink
                    icon="no"
                    tooltip={__('Remove condition', 'ab-testing-for-wp')}
                    onClick={(): void => this.removeCondition(condition)}
                  />
                </code>
              ))}
            </div>
          </div>
        )}
        {isOpened ? (
          <div className="Conditionals__New">
            <SelectControl
              label={sprintf(__('Force variant %s when...', 'ab-testing-for-wp'), variant.name)}
              value={(newConditionType || 0).toString(10)}
              options={[
                { label: __('Query parameter in URL', 'ab-testing-for-wp'), value: '0' },
                { label: __('utm_source in URL', 'ab-testing-for-wp'), value: '1' },
                { label: __('utm_medium in URL', 'ab-testing-for-wp'), value: '2' },
                { label: __('utm_campaign in URL', 'ab-testing-for-wp'), value: '3' },
              ]}
              onChange={(value): void => this.setNewConditionType(value)}
            />
            <div className="Conditionals__ValuePair">
              {newConditionType === 0 && (
                <>
                  <TextControl
                    label="Key"
                    value={newConditionKey}
                    help={showErrors && newConditionKey.trim() === '' ? __('Fill in key', 'ab-testing-for-wp') : undefined}
                    onChange={(value): void => this.setNewConditionKey(value)}
                  />
                  <div className="Conditionals__ValuePairSeparator">=</div>
                </>
              )}
              <TextControl
                label="Value"
                value={newConditionValue}
                help={showErrors && newConditionValue.trim() === '' ? __('Fill in value', 'ab-testing-for-wp') : undefined}
                onChange={(value): void => this.setNewConditionValue(value)}
              />
            </div>
            <div>
              <code>{`${newConditionKey || 'key'}=${newConditionValue || 'value'}`}</code>
            </div>

            <div className="Conditionals__Buttons">
              <Button
                isLarge
                isPrimary
                onClick={(): void => this.addCondition()}
              >
                {__('Add condition', 'ab-testing-for-wp')}
              </Button>
              <Button
                isLarge
                onClick={(): void => this.cancelNew()}
              >
                {__('Cancel', 'ab-testing-for-wp')}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            isLink
            onClick={(): void => this.setOpened(true)}
          >
            {sprintf(__('Add condition for %s', 'ab-testing-for-wp'), variant.name)}
          </Button>
        )}
      </div>
    );
  }
}

export default Conditionals;
