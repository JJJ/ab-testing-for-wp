// @flow @jsx wp.element.createElement

import shortid from 'shortid';

import {
  i18n,
  blocks,
  editor,
  data,
} from '../wp';

import VariantSelector from '../components/VariantSelector/VariantSelector';
import BoxShadow from '../components/BoxShadow/BoxShadow';
import DistributionSettings from '../components/DistributionSettings/DistributionSettings';
import GoalSelector from '../components/GoalSelector/GoalSelector';
import ControlSettings from '../components/ControlSettings/ControlSettings';
import GeneralSettings from '../components/GeneralSettings/GeneralSettings';
import TestResults from '../components/TestResults/TestResults';
import Onboarding from '../components/Onboarding/Onboarding';

import { getOption, setOption } from '../helpers/options';

import SVGIcon from './ab-test-logo';

const { __, sprintf } = i18n;
const { registerBlockType, createBlock } = blocks;
const { InnerBlocks, InspectorControls } = editor;
const { withDispatch, select } = data;

type ABTestBlockProps = {
  attributes: ABTestAttributes;
  onDeclareWinner: (id: string) => void;
} & GutenbergProps;

const ALLOWED_BLOCKS = ['ab-testing-for-wp/ab-test-block-variant'];

const makeTemplate = variant => ['ab-testing-for-wp/ab-test-block-variant', variant];

function ABTestBlock(props: ABTestBlockProps) {
  const {
    clientId,
    attributes,
    setAttributes,
    onDeclareWinner,
  } = props;

  const {
    id,
    variants,
    name,
    postGoal,
    postGoalType,
    control,
    isEnabled,
    startedAt,
    completedOnboarding,
  } = attributes;

  const cancelOnboarding = () => {
    setOption('completedOnboarding', true);
    setAttributes({ completedOnboarding: true });
  };

  // initialize attributes
  if (!id) {
    const { getCurrentPost } = select('core/editor');

    const defaultVariants: ABTestVariant[] = [
      {
        id: shortid.generate(),
        name: 'A',
        selected: true,
        distribution: 50,
      },
      {
        id: shortid.generate(),
        name: 'B',
        selected: false,
        distribution: 50,
      },
    ];

    setAttributes({
      id: shortid.generate(),
      name: sprintf(__('New test on "%s"'), getCurrentPost().title),
      variants: defaultVariants,
      postGoal: 0,
      postGoalType: '',
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
  const onNameChange = (newName: string) => setAttributes({ name: newName });
  const onPostGoalChange = (postId: number) => setAttributes({ postGoal: postId });
  const onPostGoalTypeChange = (type: string) => setAttributes({ postGoalType: type });
  const onControlChange = (variantId: string) => setAttributes({ control: variantId });
  const onEnabledChange = (enabled: boolean) => setAttributes({
    isEnabled: enabled,
    // set start time if no start time is known
    startedAt: enabled && !startedAt ? new Date() : startedAt,
  });

  const selectedVariant = variants.find(test => !!test.selected);

  const css = `
      .ABTest--${id} .ABTestVariant { 
        display: none;
      }
      
      .ABTest--${id} .ABTestVariant--${selectedVariant && selectedVariant.id ? selectedVariant.id : ''} { 
        display: block!important; 
      }
    `;

  const showOnboarding = !completedOnboarding && window.innerWidth > 780;

  return (
    <div className={`ABTest--${id}`}>
      {showOnboarding && (
        <Onboarding
          cancelOnboarding={cancelOnboarding}
          clientId={clientId}
        />
      )}
      <style>{css}</style>
      <InspectorControls>
        <GeneralSettings
          name={name}
          isEnabled={isEnabled}
          onChangeName={onNameChange}
          onChangeEnabled={onEnabledChange}
        />
        <TestResults
          isEnabled={isEnabled}
          testId={id}
          control={control}
          startedAt={startedAt}
          onDeclareWinner={onDeclareWinner}
        />
        <DistributionSettings
          variants={variants}
          onUpdateVariants={onUpdateVariants}
        />
        <GoalSelector
          value={postGoal}
          type={postGoalType}
          onChange={onPostGoalChange}
          onTypeChange={onPostGoalTypeChange}
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
}

const edit = withDispatch((dispatch, props) => {
  const { removeBlock } = dispatch('core/editor');
  const { getBlock } = select('core/editor');
  const { clientId, insertBlocksAfter } = props;

  return {
    onDeclareWinner(variantId: string) {
      const rootBlock = getBlock(clientId);
      const variantBlock = rootBlock.innerBlocks
        .find(block => block.attributes && block.attributes.id === variantId);

      if (!variantBlock) return;

      // copy inner blocks of variant
      const blockCopies = variantBlock.innerBlocks.map(block => createBlock(
        block.name,
        block.attributes,
        block.innerBlocks,
      ));

      // insert blocks after test
      insertBlocksAfter(blockCopies);

      // remove test
      removeBlock(clientId);
    },
  };
})(ABTestBlock);

registerBlockType('ab-testing-for-wp/ab-test-block', {
  title: __('A/B Test'),
  description: __('A/B test container which contains the possible variants.'),
  icon: SVGIcon,
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
    name: {
      type: 'string',
      default: '',
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
    postGoalType: {
      type: 'string',
      default: '',
    },
    startedAt: {
      type: 'string',
      default: '',
    },
    completedOnboarding: {
      type: 'boolean',
      default: !!getOption('completedOnboarding'),
      source: 'text',
    },
  },
  edit,
  save() {
    return <div><InnerBlocks.Content /></div>;
  },
});
