// @flow

import { Component, ReactNode } from 'react';

import { i18n, components, apiFetch } from '../../gutenberg';

const { __ } = i18n;
const { PanelBody, SelectControl } = components;

type PageSelectorProps = {
  value: number;
  onChange: (page: number) => void;
};

type PageSelectorState = {
  loading: boolean;
  pages: any[];
};

class PageSelector extends Component<PageSelectorProps, PageSelectorState> {
  state = {
    loading: true,
    pages: [],
  };

  componentDidMount() {
    apiFetch({ path: '/wp/v2/pages?per_page=100' })
      .then((pages) => {
        this.setState({
          pages,
          loading: false,
        });
      });
  }

  render(): ReactNode {
    const { loading, pages } = this.state;
    const { onChange, value } = this.props;

    return (
      <PanelBody title={__('Testing Goal')}>
        {!loading && (
          <>
            <SelectControl
              value={value || 0}
              options={[
                { label: __('No goal selected'), value: 0 },
                ...pages.map(page => ({ label: page.title.rendered, value: page.id })),
              ]}
              onChange={onChange}
            />
            <p>
              {__('Select the goal page for this test. If the visitor lands on this page it will add a point to the tested variant.')}
            </p>
          </>
        )}
      </PanelBody>
    );
  }
}

export default PageSelector;
