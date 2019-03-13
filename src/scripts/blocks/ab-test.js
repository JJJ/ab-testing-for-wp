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

const { __ } = i18n;
const { registerBlockType } = blocks;
const { InnerBlocks, InspectorControls } = editor;

type ABTestBlockProps = {
  attributes: {
    id: string;
    variants: ABTestVariant[];
    control: string;
    pageGoal: number;
  };
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
    pageGoal: {
      type: 'number',
      default: 0,
    },
  },
  edit(props: ABTestBlockProps) {
    const { attributes, setAttributes } = props;

    const { id, variants, pageGoal } = attributes;

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

    const onPageGoalChange = (page: number) => setAttributes({ pageGoal: page });

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
          <DistributionSettings
            variants={variants}
            onUpdateVariants={onUpdateVariants}
          />
          <PageSelector
            value={pageGoal}
            onChange={onPageGoalChange}
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
