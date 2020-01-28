import React, { Component } from 'react';

import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

import TestPreview from './TestPreview';
import Loader from '../Loader/Loader';

import { decodeLink } from '../../helpers/wordpress';

import './EditWrapper.css';

interface EditWrapperProps {
  id: string;
}

interface EditWrapperState {
  isLoading: boolean;
  html: string;
  editLink: string;
}

class EditWrapper extends Component<EditWrapperProps, EditWrapperState> {
  constructor(props: EditWrapperProps) {
    super(props);

    this.state = {
      isLoading: true,
      html: '',
      editLink: '',
    };
  }

  componentDidMount(): void {
    const { id } = this.props;

    apiFetch<{ html: string; editLink: string }>({ path: `ab-testing-for-wp/v1/get-test-content-by-post?id=${id}` })
      .then((result) => {
        this.setState({
          isLoading: false,
          html: result.html,
          editLink: decodeLink(result.editLink),
        });
      });
  }

  render(): React.ReactElement {
    const { isLoading, html, editLink } = this.state;

    return (
      <div className="EditWrapper">
        <div className="EditWrapper__Overlay">
          <Button isPrimary onClick={(): void => { window.location.href = editLink; }}>
            {__('Edit this Test', 'ab-testing-for-wp')}
          </Button>
        </div>
        {isLoading && !html ? <Loader /> : <TestPreview html={html} />}
      </div>
    );
  }
}

export default EditWrapper;
