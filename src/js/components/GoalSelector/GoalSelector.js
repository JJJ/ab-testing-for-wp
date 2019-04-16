// @flow

import React, { Component } from 'react';

import {
  i18n,
  components,
  apiFetch,
  data,
} from '../../wp';

const { __ } = i18n;
const { PanelBody, SelectControl } = components;

type GoalSelectorProps = {
  value: number;
  type: string;
  onChange: (page: number) => void;
  onTypeChange: (type: string) => void;
};

type GoalSelectorState = {
  loading: boolean;
  posts: {
    post_title: string;
    ID: number;
  }[];
  types: {
    name: string;
    label: string;
    itemName: string;
    help: string;
  }[];
};

class GoalSelector extends Component<GoalSelectorProps, GoalSelectorState> {
  state = {
    loading: true,
    posts: [],
    types: [],
  };

  componentDidMount() {
    const { value, type, onTypeChange } = this.props;

    let resolvePostType = Promise.resolve(type);

    if (!type && value) {
      resolvePostType = apiFetch({ path: `/ab-testing-for-wp/v1/get-post-type?post_id=${value}` });
    }

    const resolveTypes = apiFetch({ path: '/ab-testing-for-wp/v1/get-goal-types' });

    Promise.all([
      resolvePostType,
      resolveTypes,
    ]).then(([postType, types]) => {
      // auto select first result
      const selectedType = postType === ''
        ? types[0].name
        : postType.toString();

      if (type !== selectedType) {
        onTypeChange(selectedType);
      }

      this.setState({ types });

      this.getPostsOfType(selectedType);
    });
  }

  getPostsOfType(type: string) {
    const postId = data.select('core/editor').getCurrentPostId();

    apiFetch({ path: `/ab-testing-for-wp/v1/get-posts-by-type?type=${type}&&exclude=${postId}` })
      .then((posts) => {
        this.setState({
          posts,
          loading: false,
        });
      });
  }

  changePostType = (selectedType: string) => {
    const { onTypeChange } = this.props;

    onTypeChange(selectedType);
    this.getPostsOfType(selectedType);
  };

  render() {
    const {
      loading,
      posts,
      types,
    } = this.state;
    const { onChange, value, type } = this.props;

    const currentType = types.find(t => t.name === type) || {};

    if (!loading && !currentType) {
      return null;
    }

    return (
      <PanelBody title={__('Testing Goal')}>
        {!loading && (
          <div>
            <SelectControl
              label={__('Type')}
              value={type}
              options={types.map(t => ({
                label: t.label,
                value: t.name,
              }))}
              onChange={this.changePostType}
            />
            <SelectControl
              label={currentType.itemName}
              value={value || 0}
              options={[
                { label: __('No goal selected'), value: 0 },
                ...posts.map(post => ({ label: post.post_title, value: post.ID })),
              ]}
              help={currentType.help}
              onChange={newValue => onChange(parseInt(newValue, 10))}
            />
          </div>
        )}
      </PanelBody>
    );
  }
}

export default GoalSelector;
