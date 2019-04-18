// @flow

import React, { Component } from 'react';

import { apiFetch, components, i18n } from '../../wp';

import TestPreview from './TestPreview';
import Loader from '../Loader/Loader';

import { decodeLink } from '../../helpers/wordpress';

import './EditWrapper.css';

const { Button } = components;
const { __ } = i18n;

type EditWrapperProps = {
  id: string;
};

type EditWrapperState = {
  isLoading: boolean;
  html: string;
  editLink: string;
};

class EditWrapper extends Component<EditWrapperProps, EditWrapperState> {
  state = {
    isLoading: true,
    html: '',
    editLink: '',
  };

  componentDidMount() {
    const { id } = this.props;

    apiFetch({ path: `/ab-testing-for-wp/v1/get-test-content-by-post?id=${id}` })
      .then((result) => {
        this.setState({
          isLoading: false,
          html: result.html,
          editLink: decodeLink(result.editLink),
        });
      });
  }

  render() {
    const { isLoading, html, editLink } = this.state;

    return (
      <div className="EditWrapper">
        <div className="EditWrapper__Overlay">
          <Button isPrimary onClick={() => { window.location = editLink; }}>
            {__('Edit this Test')}
          </Button>
        </div>
        {isLoading && !html ? <Loader /> : <TestPreview html={html} />}
      </div>
    );
  }
}

export default EditWrapper;
