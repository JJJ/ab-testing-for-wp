// @flow

import React, { Component, createRef } from 'react';
import shortid from 'shortid';

type TestPreviewProps = {
  html: string;
};

class TestPreview extends Component<TestPreviewProps> {
  iframeRef = createRef<HTMLIFrameElement>();

  tempId: string = shortid.generate();

  componentDidMount() {
    const { html } = this.props;

    window.addEventListener('message', this.listenToHeight);

    if (!this.iframeRef.current) return;
    this.iframeRef.current.setAttribute(
      'src',
      `data:text/html;charset=utf-8,${escape(html.replace('%ab-testing-id%', this.tempId))}`,
    );
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
    return <iframe title="preview" ref={this.iframeRef} />;
  }
}

export default TestPreview;
