// @flow @jsx wp.element.createElement

import { createRef, Component } from 'react';

import { data, components, i18n } from '../../WP';

import Arrow from './Arrow';
import { drawOverlayAround, removeOverlay } from './Overlay';

import './Onboarding.css';

const { __ } = i18n;
const { withDispatch } = data;
const { Modal, Button } = components;

type OnboardingProps = {
  clientId: string;
  selectBlock: (clientId: string) => void;
  cancelOnboarding: () => void;
};

type OnboardingState = {
  step: number;
};

class Onboarding extends Component<OnboardingProps, OnboardingState> {
  state = {
    step: 0,
  };

  container = createRef();

  componentDidMount() {
    const { clientId, selectBlock } = this.props;

    // switch to block if rest has been loaded
    setTimeout(() => selectBlock(clientId), 0);
  }

  setupStepContainer() {
    const { step } = this.state;

    if (!this.container.current) return;
    this.stepContainer = this.container.current.cloneNode(true);

    if (!document.body) return;
    document.body.appendChild(this.stepContainer);

    // reset position and display
    this.stepContainer.style.display = 'block';
    this.stepContainer.style.top = 0;
    this.stepContainer.style.left = 0;

    const prevButton = this.stepContainer.querySelector('button.prev');
    if (prevButton) {
      prevButton.addEventListener('click', () => this.goToStep(step - 1));
    }

    const nextButton = this.stepContainer.querySelector('button.next');
    if (nextButton) {
      nextButton.addEventListener('click', () => this.goToStep(step + 1));
      nextButton.focus();
    }
  }

  placeStepContainer = (
    target,
    calcPosition: (
      targetRect: ClientRect,
      containerRect: ClientRect,
    ) => { left: number, top: number },
  ) => {
    const targetRects = target.getBoundingClientRect();
    const containerBoundingRects = this.stepContainer.getBoundingClientRect();

    const { left, top } = calcPosition(targetRects, containerBoundingRects);

    this.stepContainer.style.top = `${top}px`;
    this.stepContainer.style.left = `${left}px`;
  };

  stopTour = () => {
    const { cancelOnboarding } = this.props;

    cancelOnboarding();
    removeOverlay();
  };

  testContainer = () => {
    const { clientId } = this.props;
    return document.getElementById(`block-${clientId}`);
  };

  goToStep = (step: number) => {
    if (this.stepContainer && this.stepContainer.parentNode) {
      this.stepContainer.parentNode.removeChild(this.stepContainer);
    }

    this.setState({ step }, () => {
      if (step === 1) {
        const testContainer = this.testContainer();
        if (!testContainer) return;
        testContainer.scrollIntoView();
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
        const variantSelector = testContainer.querySelector('.ab-test-for-wp__VariantSelector');

        if (!variantSelector) return;
        variantSelector.scrollIntoView();

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
        const variantSelector = testContainer.querySelector('.ab-test-for-wp__VariantSelector');

        if (!variantSelector) return;
        variantSelector.scrollIntoView();

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
        const sideBar = document.querySelector('.edit-post-sidebar');

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
        this.setupStepContainer();
        const panel = document.querySelectorAll('.components-panel__body')[step - 3];

        panel.scrollIntoView();
        this.placeStepContainer(panel, (panelRects, containerBoundingRects) => {
          const left = panelRects.left - containerBoundingRects.width - 120;
          const top = panelRects.top - ((containerBoundingRects.height - panelRects.height) / 2);

          return { left, top };
        });

        drawOverlayAround(panel);
      }

      if (step === 8) {
        this.setupStepContainer();
        const panel = document.querySelectorAll('.components-panel__body')[1];

        panel.scrollIntoView();
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

  stepContainer;

  render() {
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
            <p>{__('This is the area where you edit your test variants, works just like the rest of the editor.')}</p>
          </div>
          <div className="buttons">
            <button className="next" type="button">{__('Next')}</button>
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
            {step === 2 && <p>{__('Switch between editing variants here.')}</p>}
            {step === 3 && <p>{__('Use the cog toggle the test options on the right.')}</p>}
          </div>
          <div className="buttons">
            <button type="button" className="prev">{__('Previous')}</button>
            <button type="button" className="next">{__('Next')}</button>
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
            {step === 4 && <p>{__('You can configure the test in this sidebar.')}</p>}
            {step === 5 && <p>{__('Adjust the distribution weight of the variants. More weight means more chance to land in experiment.')}</p>}
            {step === 6 && <p>{__('Select the goal which needs to be tracked.')}</p>}
            {step === 7 && <p>{__('Select the variant which will act like the control version. It will be shown by default when the test is not running, or when the page gets indexed by search engines.')}</p>}
            {step === 8 && <p>{__('Toggle this to enable and run the test. Without it the test will not show different variants.')}</p>}
          </div>
          <div className="buttons">
            <button type="button" className="prev">{__('Previous')}</button>
            <button type="button" className="next">{__('Next')}</button>
          </div>
        </div>
      );
    }

    if (step === 9) {
      return (
        <Modal
          title={__('That is it!')}
          className="ab-testing-for-wp__OnboardingModal"
          onRequestClose={this.stopTour}
        >
          <p>
            {__('That is all you need to know to get started.')}
          </p>
          <p>
            {__('Please contact support if you have any questions.')}
          </p>
          <div className="ButtonContainer">
            <Button isPrimary focus onClick={this.stopTour}>{__('Finish tour')}</Button>
            <Button isLink onClick={() => this.goToStep(1)}>{__('Restart tour')}</Button>
          </div>
        </Modal>
      );
    }

    return (
      <Modal
        title={__('Welcome to A/B Testing for WordPress!')}
        className="ab-testing-for-wp__OnboardingModal"
        onRequestClose={this.stopTour}
      >
        <p>
          {__('Looks like this is your first time using A/B Testing for WordPress.')}
        </p>
        <p>
          {__('Would you like a quick tour on how to setup a test?')}
        </p>
        <div className="ButtonContainer">
          <Button isPrimary focus onClick={() => this.goToStep(1)}>{__('Sure, start the tour!')}</Button>
          <Button isLink onClick={this.stopTour}>{__('No thanks')}</Button>
        </div>
      </Modal>
    );
  }
}

export default withDispatch(dispatch => ({
  selectBlock(clientId: string) {
    const { selectBlock } = dispatch('core/editor');
    selectBlock(clientId);
  },
}))(Onboarding);
