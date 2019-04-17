// @flow

import React, { Component } from 'react';

import { components, i18n, apiFetch } from '../../wp';

import Loader from './Loader';

import './Inserter.css';

const { __ } = i18n;
const { Modal, Button, SelectControl } = components;

type InserterState = {
  value: string;
  isLoading: boolean;
  isPicking: boolean;
  options: {
    ID: string,
    post_title: string,
  }[];
};

class Inserter extends Component<*, InserterState> {
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
    console.log('New');
  };

  cancelInsert = () => {
    console.log('Cancel');
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
            <Button isPrimary onClick={this.insertNew}>
              {__('Create New A/B Test')}
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
