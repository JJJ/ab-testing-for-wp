// @flow @jsx wp.element.createElement

import uniqueString from 'unique-string';

import {
  i18n,
  blocks,
  editor,
} from '../WP';

import VariantSelector from '../components/VariantSelector/VariantSelector';
import BoxShadow from '../components/BoxShadow/BoxShadow';
import DistributionSettings from '../components/DistributionSettings/DistributionSettings';
import PageSelector from '../components/PageSelector/PageSelector';
import ControlSettings from '../components/ControlSettings/ControlSettings';
import EnabledSettings from '../components/EnabledSettings/EnabledSettings';

const { __ } = i18n;
const { registerBlockType } = blocks;
const { InnerBlocks, InspectorControls } = editor;

type ABTestBlockProps = {
  attributes: ABTestAttributes;
} & GutenbergProps;

const ALLOWED_BLOCKS = ['ab-testing-for-wp/ab-test-block-variant'];

const makeTemplate = variant => ['ab-testing-for-wp/ab-test-block-variant', variant];

registerBlockType('ab-testing-for-wp/ab-test-block', {
  title: __('A/B test'),
  description: __('A/B test container which contains the possible variants.'),
  icon: 'admin-settings',
  category: 'widgets',
  attributes: {
    id: {
      type: 'string',
      default: '',
    },
    variants: {
      type: 'array',
      default: [],
    },
    control: {
      type: 'string',
      default: '',
    },
    isEnabled: {
      type: 'boolean',
      default: false,
    },
    postGoal: {
      type: 'number',
      default: 0,
    },
  },
  edit(props: ABTestBlockProps) {
    const { attributes, setAttributes } = props;

    const {
      id,
      variants,
      postGoal,
      control,
      isEnabled,
    } = attributes;

    // initialize attributes
    if (!id) {
      const defaultVariants: ABTestVariant[] = [
        {
          id: uniqueString(),
          name: 'A',
          selected: true,
          distribution: 50,
        },
        {
          id: uniqueString(),
          name: 'B',
          selected: false,
          distribution: 50,
        },
      ];

      setAttributes({
        id: uniqueString(),
        variants: defaultVariants,
        postGoal: 0,
        control: defaultVariants[0].id,
        isEnabled: false,
      });
    }

    const onSelectVariant = (variantId: string) => {
      setAttributes({
        variants: variants.map(variant => ({ ...variant, selected: variant.id === variantId })),
      });
    };
    const onUpdateVariants = (newVariants: ABTestVariant[]) => setAttributes({
      variants: newVariants,
    });
    const onPostGoalChange = (postId: number) => setAttributes({ postGoal: postId });
    const onControlChange = (variantId: string) => setAttributes({ control: variantId });
    const onEnabledChange = (enabled: boolean) => setAttributes({ isEnabled: enabled });

    const selectedVariant = variants.find(test => !!test.selected);

    const css = `
      .ABTest--${id} .ABTestVariant { 
        display: none;
      }
      
      .ABTest--${id} .ABTestVariant--${selectedVariant && selectedVariant.id ? selectedVariant.id : ''} { 
        display: block!important; 
      }
    `;

    return (
      <div className={`ABTest--${id}`}>
        <style>{css}</style>
        <InspectorControls>
          <EnabledSettings
            value={isEnabled}
            onChange={onEnabledChange}
          />
          <DistributionSettings
            variants={variants}
            onUpdateVariants={onUpdateVariants}
          />
          <PageSelector
            value={postGoal}
            onChange={onPostGoalChange}
          />
          <ControlSettings
            value={control}
            variants={variants}
            onChange={onControlChange}
          />
        </InspectorControls>
        <InnerBlocks
          templateLock="all"
          template={variants.map(makeTemplate)}
          allowedBlocks={ALLOWED_BLOCKS}
        />
        <VariantSelector
          variants={variants}
          onSelectVariant={onSelectVariant}
        />
        <BoxShadow />
      </div>
    );
  },
  save() {
    return <div><InnerBlocks.Content /></div>;
  },
});
