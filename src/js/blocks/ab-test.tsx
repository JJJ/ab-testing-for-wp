import React, { Component } from 'react';
import shortid from 'shortid';
import queryString from 'query-string';

import { __, sprintf } from '@wordpress/i18n';
import { registerBlockType, createBlock, BlockInstance } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { withDispatch, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

import parseISO from 'date-fns/parseISO';

import VariantSelector from '../components/VariantSelector/VariantSelector';
import BoxShadow from '../components/BoxShadow/BoxShadow';
import VariantSettings from '../components/VariantSettings/VariantSettings';
import GoalSelector from '../components/GoalSelector/GoalSelector';
import GeneralSettings from '../components/GeneralSettings/GeneralSettings';
import TestResults from '../components/TestResults/TestResults';
import Onboarding from '../components/Onboarding/Onboarding';
import Loader from '../components/Loader/Loader';

import { getOption, setOption } from '../helpers/options';

import SVGIcon from '../components/Logo/Logo';

interface ABTestBlockProps extends BlockInstance<ABTestAttributes> {
  setAttributes: (attrs: any) => void;
  onDeclareWinner: (id: string) => void;
  selectBlock: () => void;
}

interface ABTestBlockState {
  loadedAttributes: boolean;
}

const ALLOWED_BLOCKS = ['ab-testing-for-wp/ab-test-block-variant'];

const makeTemplate = (variant: ABTestVariant): [string, ABTestVariant] => ['ab-testing-for-wp/ab-test-block-variant', variant];

function isSingleTest(): boolean {
  const { getCurrentPostType } = select('core/editor');
  return getCurrentPostType() === 'abt4wp-test';
}

class ABTestBlock extends Component<ABTestBlockProps, ABTestBlockState> {
  currentVariant: string | undefined;

  constructor(props: ABTestBlockProps) {
    super(props);

    this.state = {
      loadedAttributes: false,
    };
  }

  componentDidMount(): void {
    this.loadAttributes();
    this.selectOnSingleTest();
    this.focusTestIntoView();
  }

  loadAttributes(): void {
    const { attributes, setAttributes } = this.props;

    if (!attributes.id) {
      this.setState({ loadedAttributes: true });
      return;
    }

    apiFetch<TestData[]>({ path: `ab-testing-for-wp/v1/get-tests-info?id[]=${attributes.id}` })
      .then(([test]) => {
        if (!test) {
          // for some reason the test didn't load... gracefully fail
          return true;
        }

        setAttributes({
          id: test.id,
          postGoal: test.postGoal,
          postGoalType: test.postGoalType,
          title: test.title,
          control: test.control,
          isEnabled: test.isEnabled,
        });

        return true;
      })
      .then(() => {
        this.setState({ loadedAttributes: true });
      });
  }

  selectOnSingleTest(): void {
    const { selectBlock } = this.props;

    setTimeout(() => { if (isSingleTest()) selectBlock(); }, 0);
  }

  focusTestIntoView(): void {
    const { attributes, clientId, selectBlock } = this.props;
    const { test } = queryString.parse(window.location.search);

    // check if test from querystring is this test
    if (attributes.id !== test) return;

    // this hack is needed for Gutenberg :(
    setTimeout(() => {
      // find the block in the content
      const block = document.getElementById(`block-${clientId}`);
      if (!block) return;

      // scroll to block
      block.scrollIntoView({ block: 'center' });

      // select block in editor
      selectBlock();
    }, 0);
  }

  showVariant(id: string, selected?: ABTestVariant): void {
    if (!selected) return;
    if (this.currentVariant === selected.id) return;

    const variants = document.querySelectorAll<HTMLElement>(`.ABTest--${id} .wp-block[data-type="ab-testing-for-wp/ab-test-block-variant"]`);

    // if DOM is not mounted yet, try again on first possibility
    if (variants.length === 0) setTimeout(() => this.showVariant(id, selected), 0);

    variants.forEach((variant) => {
      if (!selected) return;

      const hasSelected = variant.querySelector(`.ABTestVariant--${selected.id}`);
      if (hasSelected) {
        variant.style.display = 'block'; // eslint-disable-line

        // update current variant
        this.currentVariant = selected.id;
        return;
      }

      variant.style.display = 'none'; // eslint-disable-line
    });
  }

  render(): React.ReactNode {
    const {
      clientId,
      attributes,
      setAttributes,
      onDeclareWinner,
      selectBlock,
    } = this.props;

    const { loadedAttributes } = this.state;

    if (!loadedAttributes) {
      return <div style={{ justifyContent: 'center', display: 'flex', padding: '1em' }}><Loader /></div>;
    }

    const {
      id,
      variants,
      title,
      postGoal,
      postGoalType,
      control,
      isEnabled,
      startedAt,
      completedOnboarding,
      defaultContent,
    } = attributes;

    const cancelOnboarding = (): void => {
      setOption('completedOnboarding', true);
      setAttributes({ completedOnboarding: true });
    };

    // initialize attributes
    if (!id) {
      const defaultVariants: ABTestVariant[] = [
        {
          id: shortid.generate(),
          name: 'A',
          selected: true,
          distribution: 50,
          defaultContent,
          conditions: [],
        },
        {
          id: shortid.generate(),
          name: 'B',
          selected: false,
          distribution: 50,
          defaultContent,
          conditions: [],
        },
      ];

      const { getCurrentPost } = select('core/editor');
      const postTitle = getCurrentPost<{ title: string }>().title;

      setAttributes({
        id: shortid.generate(),
        variants: defaultVariants,
        postGoal: '',
        postGoalType: '',
        title: isSingleTest() ? '' : sprintf(__('New test on "%s"', 'ab-testing-for-wp'), postTitle),
        control: defaultVariants[0].id,
        isEnabled: false,
      });
    }

    const onSelectVariant = (variantId: string): void => {
      setAttributes({
        variants: variants.map((variant) => ({ ...variant, selected: variant.id === variantId })),
      });
    };
    const onUpdateVariants = (newVariants: ABTestVariant[]): void => setAttributes({
      variants: newVariants,
    });
    const onTitleChange = (newTitle: string): void => setAttributes({ title: newTitle });
    const onPostGoalChange = (value: string): void => setAttributes({ postGoal: value });
    const onPostGoalTypeChange = (type: string): void => setAttributes({ postGoalType: type });
    const onControlChange = (variantId: string): void => setAttributes({ control: variantId });
    const onEnabledChange = (enabled: boolean): void => setAttributes({
      isEnabled: enabled,
      // set start time if no start time is known
      startedAt: enabled && !startedAt ? new Date() : startedAt,
    });

    const selectedVariant = variants.find((variant) => variant.selected);

    // side effect...
    this.showVariant(id, selectedVariant);

    const showOnboarding = !completedOnboarding
      && window.innerWidth > 780
      && window.location.search.indexOf('skipOnboarding=1') === -1;
    const isSingle = isSingleTest();

    return (
      <div className={`ABTest--${id}`}>
        {showOnboarding && (
          <Onboarding
            clientId={clientId}
            cancelOnboarding={cancelOnboarding}
            selectBlock={selectBlock}
          />
        )}

        <style>{`.ABTest--${id} .wp-block[data-type="ab-testing-for-wp/ab-test-block-variant"] { display: none; }`}</style>

        <InspectorControls>
          <GeneralSettings
            isSingle={isSingle}
            title={title}
            isEnabled={isEnabled}
            onChangeTitle={onTitleChange}
            onChangeEnabled={onEnabledChange}
          />
          <TestResults
            isEnabled={isEnabled}
            testId={id}
            control={control}
            startedAt={typeof startedAt === 'string' ? parseISO(startedAt) : startedAt}
            onDeclareWinner={onDeclareWinner}
          />
          <GoalSelector
            value={postGoal}
            type={postGoalType}
            onChange={onPostGoalChange}
            onTypeChange={onPostGoalTypeChange}
          />
          <VariantSettings
            control={control}
            variants={variants}
            onControlChange={onControlChange}
            onUpdateVariants={onUpdateVariants}
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
}

const edit: any = withDispatch((dispatch, props: any) => {
  const { removeBlock } = dispatch('core/block-editor');
  const { getBlock } = select('core/block-editor');
  const { clientId, insertBlocksAfter } = props;

  return {
    onDeclareWinner(variantId: string): void {
      const rootBlock = getBlock(clientId);

      if (!rootBlock) return;

      const variantBlock = rootBlock.innerBlocks
        .find((block) => block.attributes && block.attributes.id === variantId);

      if (!variantBlock) return;

      // copy inner blocks of variant
      const blockCopies = variantBlock.innerBlocks.map((block: BlockInstance) => createBlock(
        block.name,
        block.attributes,
        block.innerBlocks,
      ));

      // insert blocks after test
      insertBlocksAfter(blockCopies);

      // remove test
      removeBlock(clientId);
    },
    selectBlock(): void {
      const { selectBlock } = dispatch('core/block-editor');
      const { openGeneralSidebar } = dispatch('core/edit-post');
      selectBlock(clientId);
      openGeneralSidebar('edit-post/block');
    },
  };
})(ABTestBlock as any);

registerBlockType('ab-testing-for-wp/ab-test-block', {
  title: __('A/B Test Container', 'ab-testing-for-wp'),
  description: __('A/B test container which contains the possible variants.', 'ab-testing-for-wp'),
  icon: SVGIcon,
  category: 'widgets',
  supports: {
    inserter: false,
  },
  attributes: {
    id: {
      type: 'string',
      default: '',
    },
    variants: {
      type: 'array',
      default: [],
    },
    title: {
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
      type: 'string',
      default: '',
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
    },
    defaultContent: {
      type: 'array',
      default: undefined,
    },
  },
  edit,
  save() {
    return <div><InnerBlocks.Content /></div>;
  },
});
