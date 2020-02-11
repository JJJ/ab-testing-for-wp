import React, { createRef, Component } from 'react';
import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';

import Arrow from './Arrow';
import { drawOverlayAround, removeOverlay } from './Overlay';

import './Onboarding.css';

type OnboardingProps = {
  clientId: string;
  selectBlock: () => void;
  cancelOnboarding: () => void;
};

type OnboardingState = {
  step: number;
};

class Onboarding extends Component<OnboardingProps, OnboardingState> {
  container = createRef<HTMLDivElement>();

  stepContainer: HTMLElement | undefined;

  constructor(props: OnboardingProps) {
    super(props);

    this.state = {
      step: 0,
    };
  }

  componentDidMount(): void {
    const { selectBlock } = this.props;

    // switch to block if rest has been loaded
    setTimeout(selectBlock, 0);
  }

  setupStepContainer(): void {
    const { step } = this.state;

    if (!this.container.current) return;
    this.stepContainer = this.container.current.cloneNode(true) as HTMLDivElement;

    if (!document.body) return;
    document.body.appendChild(this.stepContainer);

    // reset position and display
    this.stepContainer.style.display = 'block';
    this.stepContainer.style.top = '0';
    this.stepContainer.style.left = '0';

    const prevButton = this.stepContainer.querySelector('button.prev');
    if (prevButton) {
      prevButton.addEventListener('click', () => this.goToStep(step - 1));
    }

    const nextButton = this.stepContainer.querySelector<HTMLElement>('button.next');
    if (nextButton) {
      nextButton.addEventListener('click', () => this.goToStep(step + 1));
      nextButton.focus();
    }
  }

  placeStepContainer = (
    target: HTMLElement,
    calcPosition: (
      targetRect: ClientRect,
      containerRect: ClientRect,
    ) => { left: number; top: number },
  ): void => {
    if (!this.stepContainer) return;

    const targetRects = target.getBoundingClientRect();
    const containerBoundingRects = this.stepContainer.getBoundingClientRect();

    const { left, top } = calcPosition(targetRects, containerBoundingRects);

    this.stepContainer.style.top = `${top}px`;
    this.stepContainer.style.left = `${left}px`;
  };

  stopTour = (): void => {
    const { cancelOnboarding } = this.props;

    cancelOnboarding();
    removeOverlay();
  };

  testContainer = (): HTMLElement | null => {
    const { clientId } = this.props;
    return document.getElementById(`block-${clientId}`);
  };

  goToStep = (step: number): void => {
    if (this.stepContainer && this.stepContainer.parentNode) {
      this.stepContainer.parentNode.removeChild(this.stepContainer);
    }

    this.setState({ step }, () => {
      if (step === 1) {
        const testContainer = this.testContainer();
        if (!testContainer) return;
        testContainer.scrollIntoView({ block: 'center' });
        this.setupStepContainer();

        this.placeStepContainer(testContainer, (testBoundingRects, containerBoundingRects) => {
          const offsetLeft = (testBoundingRects.width - containerBoundingRects.width) / 2;
          const left = testBoundingRects.left + offsetLeft;
          const top = testBoundingRects.bottom + 60;

          return { left, top };
        });

        drawOverlayAround(testContainer, 70, 50, 40, 20);
      }

      if (step === 2) {
        this.setupStepContainer();
        const testContainer = this.testContainer();

        if (!testContainer) return;
        const variantSelector = testContainer.querySelector<HTMLElement>('.ab-test-for-wp__VariantSelector');

        if (!variantSelector) return;
        variantSelector.scrollIntoView({ block: 'center' });

        this.placeStepContainer(variantSelector, (variantBoundingRects, containerBoundingRects) => {
          const left = variantBoundingRects.left - containerBoundingRects.width - 60;
          const top = variantBoundingRects.top
            - containerBoundingRects.height;

          return { left, top };
        });

        drawOverlayAround(variantSelector, 10, 10, 10, 10);
      }

      if (step === 3) {
        this.setupStepContainer();
        const testContainer = this.testContainer();

        if (!testContainer) return;
        const variantSelector = testContainer.querySelector<HTMLElement>('.ab-test-for-wp__VariantSelector');

        if (!variantSelector) return;
        variantSelector.scrollIntoView({ block: 'center' });

        this.placeStepContainer(variantSelector, (variantBoundingRects, containerBoundingRects) => {
          const left = variantBoundingRects.left - containerBoundingRects.width - 60;
          const top = variantBoundingRects.top
            - containerBoundingRects.height
            + 60;

          return { left, top };
        });

        drawOverlayAround(variantSelector, 10, 10, 10, 10);
      }

      if (step === 4) {
        this.setupStepContainer();
        const sideBar = document.querySelector<HTMLElement>('.edit-post-sidebar');

        if (!sideBar) return;
        this.placeStepContainer(sideBar, (sideBarRects, containerBoundingRects) => {
          const left = sideBarRects.left - containerBoundingRects.width - 60;
          const top = sideBarRects.top
            + containerBoundingRects.height;

          return { left, top };
        });

        drawOverlayAround(sideBar);
      }

      if (step === 5 || step === 6 || step === 7) {
        const panels = { 5: 2, 6: 3, 7: 3 };

        this.setupStepContainer();
        const panel = document.querySelectorAll<HTMLElement>('.components-panel__body')[panels[step]];

        panel.scrollIntoView({ block: 'center' });
        this.placeStepContainer(panel, (panelRects, containerBoundingRects) => {
          const left = panelRects.left - containerBoundingRects.width - 120;
          const top = panelRects.top - ((containerBoundingRects.height - panelRects.height) / 2);

          return { left, top };
        });

        drawOverlayAround(panel);
      }

      if (step === 8) {
        this.setupStepContainer();
        const panel = document.querySelectorAll<HTMLElement>('.components-panel__body')[1];

        panel.scrollIntoView({ block: 'center' });
        this.placeStepContainer(panel, (panelRects, containerBoundingRects) => {
          const left = panelRects.left - containerBoundingRects.width - 120;
          const top = panelRects.top - ((containerBoundingRects.height - panelRects.height) / 2);

          return { left, top };
        });

        drawOverlayAround(panel);
      }

      if (step === 9) removeOverlay();
    });
  };

  render(): React.ReactNode {
    const { step } = this.state;

    if (step === 1) {
      return (
        <div ref={this.container} className="ab-testing-for-wp__Onboarding">
          <Arrow
            style={{
              position: 'absolute',
              left: -75,
              transform: 'rotate(-83deg)',
              top: -10,
            }}
          />
          <div className="content">
            <p>{__('This is the area where you edit your test variants, works just like the rest of the editor.', 'ab-testing-for-wp')}</p>
          </div>
          <div className="buttons">
            <button className="next" type="button">{__('Next', 'ab-testing-for-wp')}</button>
          </div>
        </div>
      );
    }

    if (step === 2 || step === 3) {
      return (
        <div ref={this.container} className="ab-testing-for-wp__Onboarding">
          <Arrow
            style={{
              position: 'absolute',
              right: -25,
              transform: 'rotate(156deg) scaleX(-1)',
              top: '100%',
            }}
          />
          <div className="content">
            {step === 2 && <p>{__('Switch between editing variants here.', 'ab-testing-for-wp')}</p>}
            {step === 3 && <p>{__('Use the cog toggle the test options on the right.', 'ab-testing-for-wp')}</p>}
          </div>
          <div className="buttons">
            <button type="button" className="prev">{__('Previous', 'ab-testing-for-wp')}</button>
            <button type="button" className="next">{__('Next', 'ab-testing-for-wp')}</button>
          </div>
        </div>
      );
    }

    if (step === 4 || step === 5 || step === 6 || step === 7 || step === 8) {
      return (
        <div ref={this.container} className="ab-testing-for-wp__Onboarding">
          <Arrow
            style={{
              position: 'absolute',
              right: step === 4 ? -25 : -100,
              transform: 'rotate(35deg)',
              top: step === 4 ? -60 : 30,
            }}
          />
          <div className="content">
            {step === 4 && <p>{__('You can configure the test in this sidebar.', 'ab-testing-for-wp')}</p>}
            {step === 5 && <p>{__('Select the goal of the test which needs to be tracked.', 'ab-testing-for-wp')}</p>}
            {step === 6 && <p>{__('Select the variant which will act like the control version. It will be shown by default when the test is not running, or when the page gets indexed by search engines.', 'ab-testing-for-wp')}</p>}
            {step === 7 && <p>{__('Also, adjust the distribution weight and conditions of the variants. More weight means more chance to land in experiment.', 'ab-testing-for-wp')}</p>}
            {step === 8 && <p>{__('Toggle this to enable and run the test. Without it the test will not show different variants.', 'ab-testing-for-wp')}</p>}
          </div>
          <div className="buttons">
            <button type="button" className="prev">{__('Previous', 'ab-testing-for-wp')}</button>
            <button type="button" className="next">{__('Next', 'ab-testing-for-wp')}</button>
          </div>
        </div>
      );
    }

    if (step === 9) {
      return (
        <Modal
          title={__('That is it!', 'ab-testing-for-wp')}
          className="ab-testing-for-wp__OnboardingModal"
          onRequestClose={this.stopTour}
        >
          <p>
            {__('That is all you need to know to get started.', 'ab-testing-for-wp')}
          </p>
          <p>
            {__('Please contact support if you have any questions.', 'ab-testing-for-wp')}
          </p>
          <div className="ButtonContainer">
            <Button isPrimary autoFocus onClick={this.stopTour}>{__('Finish tour', 'ab-testing-for-wp')}</Button>
            <Button isLink onClick={(): void => this.goToStep(1)}>{__('Restart tour', 'ab-testing-for-wp')}</Button>
          </div>
        </Modal>
      );
    }

    return (
      <Modal
        title={__('Welcome to A/B Testing for WordPress!', 'ab-testing-for-wp')}
        className="ab-testing-for-wp__OnboardingModal"
        shouldCloseOnClickOutside={false}
        onRequestClose={this.stopTour}
      >
        <p>
          {__('Looks like this is your first time using A/B Testing for WordPress.', 'ab-testing-for-wp')}
        </p>
        <p>
          {__('Would you like a quick tour on how to setup a test?', 'ab-testing-for-wp')}
        </p>
        <div className="ButtonContainer">
          <Button isPrimary autoFocus onClick={(): void => this.goToStep(1)}>{__('Sure, start the tour!', 'ab-testing-for-wp')}</Button>
          <Button isLink onClick={this.stopTour}>{__('No thanks', 'ab-testing-for-wp')}</Button>
        </div>
      </Modal>
    );
  }
}

export default Onboarding;
