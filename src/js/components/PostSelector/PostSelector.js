// @flow @jsx wp.element.createElement

import { Component } from 'react';

import {
  i18n,
  components,
  apiFetch,
  data,
} from '../../WP';

const { __ } = i18n;
const { PanelBody, SelectControl } = components;

type PostSelectorProps = {
  value: number;
  onChange: (page: number) => void;
};

type PostSelectorState = {
  loading: boolean;
  pages: any[];
};

class PostSelector extends Component<PostSelectorProps, PostSelectorState> {
  state = {
    loading: true,
    pages: [],
  };

  componentDidMount() {
    const pageId = data.select('core/editor').getCurrentPostId();

    apiFetch({ path: `/wp/v2/pages?per_page=100&exclude=${pageId}` })
      .then((pages) => {
        this.setState({
          pages,
          loading: false,
        });
      });
  }

  render() {
    const { loading, pages } = this.state;
    const { onChange, value } = this.props;

    return (
      <PanelBody title={__('Testing Goal')}>
        {!loading && (
          <SelectControl
            value={value || 0}
            options={[
              { label: __('No goal selected'), value: 0 },
              ...pages.map(page => ({ label: page.title.rendered, value: page.id })),
            ]}
            onChange={newValue => onChange(parseInt(newValue, 10))}
            help={__('Goal page for this test. If the visitor lands on this page it will add a point to the tested variant.')}
          />
        )}
      </PanelBody>
    );
  }
}

export default PostSelector;
