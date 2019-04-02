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
  selectedType: string;
  posts: {
    post_title: string;
    ID: number;
  }[];
  types: {
    [key: string]: {
      name: string;
      slug: string;
    };
  };
};

class PostSelector extends Component<PostSelectorProps, PostSelectorState> {
  state = {
    loading: true,
    posts: [],
    types: {},
    selectedType: '',
  };

  forbiddenTypes = ['attachment', 'wp_block'];

  componentDidMount() {
    const { value } = this.props;

    let resolvePostType = Promise.resolve('');

    if (value) {
      resolvePostType = apiFetch({ path: `/ab-testing-for-wp/v1/get-post-type?post_id=${value}` });
    }

    const resolveTypes = apiFetch({ path: '/wp/v2/types' })
      // filter out only acceptable types for now
      .then(types => ({ page: types.page, post: types.post }));

    Promise.all([
      resolvePostType,
      resolveTypes,
    ]).then(([postType, types]) => {
      const filteredTypes = { ...types };
      this.forbiddenTypes.forEach(type => delete filteredTypes[type]);

      // auto select first result
      const selectedType = postType === ''
        ? filteredTypes[Object.keys(filteredTypes)[0]].slug
        : postType.toString();

      this.setState({
        types: filteredTypes,
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

    console.log(selectedType);

    return (
      <PanelBody title={__('Testing Goal')}>
        {!loading && (
          <div>
            <SelectControl
              label={__('Type')}
              value={selectedType}
              options={Object.keys(types).map(type => ({
                label: types[type].name,
                value: types[type].slug,
              }))}
              onChange={this.changePostType}
            />
            <SelectControl
              label={__('Post')}
              value={value || 0}
              options={[
                { label: __('No goal selected'), value: 0 },
                ...posts.map(post => ({ label: post.post_title, value: post.ID })),
              ]}
              onChange={newValue => onChange(parseInt(newValue, 10))}
              help={__('Goal page for this test. If the visitor lands on this page it will add a point to the tested variant.')}
            />
          </div>
        )}
      </PanelBody>
    );
  }
}

export default PostSelector;
