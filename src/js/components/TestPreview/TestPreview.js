// @flow

import React, { Component, createRef } from 'react';
import shortid from 'shortid';

import { apiFetch } from '../../wp';

import Loader from '../Loader/Loader';

type TestPreviewProps = {
  id: string;
};

type TestPreviewState = {
  isLoading: boolean;
};

class TestPreview extends Component<TestPreviewProps, TestPreviewState> {
  state = {
    isLoading: true,
  };

  iframeRef = createRef<HTMLIFrameElement>();

  tempId: string = shortid.generate();

  componentDidMount() {
    const { id } = this.props;

    window.addEventListener('message', this.listenToHeight);

    apiFetch({ path: `/ab-testing-for-wp/v1/get-test-content-by-post?id=${id}` })
      .then((result) => {
        this.setState({
          isLoading: false,
        });

        if (!this.iframeRef.current) return;
        this.iframeRef.current.setAttribute(
          'src',
          `data:text/html;charset=utf-8,${escape(result.html.replace('%ab-testing-id%', this.tempId))}`,
        );
      });
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.listenToHeight);
  }

  listenToHeight = (e: MessageEvent) => {
    try {
      if (typeof e.data !== 'string') return;
      const data = JSON.parse(e.data);
      if (data.from !== this.tempId) return;
      if (!this.iframeRef.current) return;
      this.iframeRef.current.style.height = `${data.height}px`;
    } catch (err) {
      // fail silently
    }
  };

  render() {
    const { isLoading } = this.state;

    if (isLoading) return <div className="Inserter__loader"><Loader /></div>;

    return <iframe title="preview" ref={this.iframeRef} />;
  }
}

export default TestPreview;
