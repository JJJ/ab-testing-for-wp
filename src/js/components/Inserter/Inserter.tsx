import React, { Component } from 'react';

import { __ } from '@wordpress/i18n';
import { Modal, Button, SelectControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

import Loader from '../Loader/Loader';

import './Inserter.css';

type InserterProps = {
  pickTest: (id: string) => void;
  removeSelf: () => void;
  insertNew: () => void;
};

type InserterState = {
  value: string;
  isLoading: boolean;
  isPicking: boolean;
  options: {
    ID: string;
    post_title: string;
  }[];
};

class Inserter extends Component<InserterProps, InserterState> {
  state = {
    value: '',
    isLoading: true,
    isPicking: false,
    options: [],
  };

  componentDidMount() {
    apiFetch({ path: '/ab-testing-for-wp/v1/get-posts-by-type?type=abt4wp-test' })
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

  insertNew = () => {
    const { insertNew } = this.props;

    insertNew();
  };

  cancelInsert = () => {
    const { removeSelf } = this.props;

    removeSelf();
  };

  insertExisting = () => {
    const { pickTest } = this.props;
    const { value } = this.state;

    pickTest(value);
  };

  render() {
    const {
      value,
      isLoading,
      isPicking,
      options,
    } = this.state;

    if (isLoading) return <div className="Inserter__loader"><Loader /></div>;

    return (
      <Modal
        title={__('A/B Testing for WordPress')}
        className="Inserter"
        onRequestClose={this.cancelInsert}
      >
        {isPicking ? (
          <section className="Inserter__picking">
            <SelectControl
              label={__('Pick A/B Test')}
              selected={value}
              options={options.map(option => ({
                label: option.post_title,
                value: option.ID,
              }))}
              onChange={newValue => this.setState({ value: newValue })}
            />
            <Button isPrimary onClick={this.insertExisting} style={{ marginRight: 5 }}>
              {__('Insert into Content')}
            </Button>
            <Button isDefault onClick={() => this.setState({ isPicking: false })}>
              {__('Cancel')}
            </Button>
          </section>
        ) : (
          <section className="Inserter__actions">
            <Button isPrimary onClick={this.insertNew}>
              {__('Create New A/B Test')}
            </Button>
            <Button isDefault onClick={() => this.setState({ isPicking: true })}>
              {__('Insert Existing A/B Test')}
            </Button>
          </section>
        )}
      </Modal>
    );
  }
}

export default Inserter;
