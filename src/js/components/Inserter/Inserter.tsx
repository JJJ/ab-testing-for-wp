import React, { Component } from 'react';

import { __ } from '@wordpress/i18n';
import { Modal, Button, SelectControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

import Loader from '../Loader/Loader';

import './Inserter.css';

interface WPPost {
  ID: string;
  post_title: string;
}

interface InserterProps {
  pickTest: (id: string) => void;
  removeSelf: () => void;
  insertNew: () => void;
}

interface InserterState {
  value: string;
  isLoading: boolean;
  isPicking: boolean;
  options: WPPost[];
}

class Inserter extends Component<InserterProps, InserterState> {
  constructor(props: InserterProps) {
    super(props);

    this.state = {
      value: '',
      isLoading: true,
      isPicking: false,
      options: [],
    };
  }

  componentDidMount(): void {
    apiFetch<WPPost[]>({ path: 'ab-testing-for-wp/v1/get-posts-by-type?type=abt4wp-test' })
      .then((options) => {
        if (options.length === 0) {
          this.insertNew();
          return;
        }

        this.setState({
          isLoading: false,
          value: options[0].ID,
          options,
        });
      });
  }

  insertNew = (): void => {
    const { insertNew } = this.props;

    insertNew();
  };

  cancelInsert = (): void => {
    const { removeSelf } = this.props;

    removeSelf();
  };

  insertExisting = (): void => {
    const { pickTest } = this.props;
    const { value } = this.state;

    pickTest(value);
  };

  render(): React.ReactElement {
    const {
      value,
      isLoading,
      isPicking,
      options,
    } = this.state;

    if (isLoading) return <div className="Inserter__loader"><Loader /></div>;

    return (
      <Modal
        title={__('A/B Testing for WordPress', 'ab-testing-for-wp')}
        className="Inserter"
        onRequestClose={this.cancelInsert}
      >
        {isPicking ? (
          <section className="Inserter__picking">
            <SelectControl
              label={__('Pick A/B Test', 'ab-testing-for-wp')}
              value={value}
              options={options.map((option) => ({
                label: option.post_title,
                value: option.ID,
              }))}
              onChange={(newValue): void => this.setState({ value: newValue })}
            />
            <Button isPrimary onClick={this.insertExisting} style={{ marginRight: 5 }}>
              {__('Insert into Content', 'ab-testing-for-wp')}
            </Button>
            <Button isDefault onClick={(): void => this.setState({ isPicking: false })}>
              {__('Cancel')}
            </Button>
          </section>
        ) : (
          <section className="Inserter__actions">
            <Button isPrimary onClick={this.insertNew}>
              {__('Create New A/B Test', 'ab-testing-for-wp')}
            </Button>
            <Button isDefault onClick={(): void => this.setState({ isPicking: true })}>
              {__('Insert Existing A/B Test', 'ab-testing-for-wp')}
            </Button>
          </section>
        )}
      </Modal>
    );
  }
}

export default Inserter;
