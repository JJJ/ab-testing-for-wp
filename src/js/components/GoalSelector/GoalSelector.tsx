import React, { Component } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';
import { select } from '@wordpress/data';

interface GoalSelectorProps {
  value: number;
  type: string;
  onChange: (page: number) => void;
  onTypeChange: (type: string) => void;
}

interface GoalPostType {
  name: string;
  label: string;
  itemName: string;
  help: string;
}

interface GoalExternalPost {
  post_title: string;
  ID: number;
}

interface GoalSelectorState {
  loading: boolean;
  posts: GoalExternalPost[];
  types: GoalPostType[];
}

class GoalSelector extends Component<GoalSelectorProps, GoalSelectorState> {
  constructor(props: GoalSelectorProps) {
    super(props);

    this.state = {
      loading: true,
      posts: [],
      types: [],
    };
  }

  componentDidMount(): void {
    const { value, type, onTypeChange } = this.props;

    const resolvePostType = !type && value
      ? apiFetch<string>({ path: `/ab-testing-for-wp/v1/get-post-type?post_id=${value}` })
      : Promise.resolve(type);

    const resolveTypes = apiFetch<GoalPostType[]>({ path: '/ab-testing-for-wp/v1/get-goal-types' });

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

  getPostsOfType(type: string): void {
    const postId = select('core/editor').getCurrentPostId();

    apiFetch<GoalExternalPost[]>({ path: `/ab-testing-for-wp/v1/get-posts-by-type?type=${type}&&exclude=${postId}` })
      .then((posts) => {
        this.setState({
          posts,
          loading: false,
        });
      });
  }

  changePostType = (selectedType: string): void => {
    const { onTypeChange } = this.props;

    onTypeChange(selectedType);
    this.getPostsOfType(selectedType);
  };

  render(): React.ReactNode {
    const {
      loading,
      posts,
      types,
    } = this.state;
    const { onChange, value, type } = this.props;

    const currentType = types.find((t) => t.name === type) || { itemName: '', help: '' };

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
              options={types.map((t) => ({
                label: t.label,
                value: t.name,
              }))}
              onChange={this.changePostType}
            />
            <SelectControl
              label={currentType.itemName}
              value={(value || 0).toString(10)}
              options={[
                { label: __('No goal selected'), value: '0' },
                ...posts.map((post) => ({ label: post.post_title, value: post.ID.toString() })),
              ]}
              help={currentType.help}
              onChange={(newValue: string): void => onChange(parseInt(newValue, 10))}
            />
          </div>
        )}
      </PanelBody>
    );
  }
}

export default GoalSelector;
