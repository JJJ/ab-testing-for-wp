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

type GoalSelectorProps = {
  value: number;
  onChange: (page: number) => void;
};

type GoalSelectorState = {
  loading: boolean;
  selectedType: string;
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
    selectedType: '',
  };

  componentDidMount() {
    const { value } = this.props;

    let resolvePostType = Promise.resolve('');

    if (value) {
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

      this.setState({
        types,
        selectedType,
      });

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
    this.setState({ selectedType });
    this.getPostsOfType(selectedType);
  };

  render() {
    const {
      loading,
      posts,
      types,
      selectedType,
    } = this.state;
    const { onChange, value } = this.props;

    const currentType = types.find(type => type.name === selectedType) || {};

    if (!loading && !currentType) {
      return null;
    }

    return (
      <PanelBody title={__('Testing Goal')}>
        {!loading && (
          <div>
            <SelectControl
              label={__('Type')}
              value={selectedType}
              options={types.map(type => ({
                label: type.label,
                value: type.name,
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
