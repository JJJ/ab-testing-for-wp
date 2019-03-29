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

  testContainer = () => {
    const { clientId } = this.props;
    return document.getElementById(`block-${clientId}`);
  };

  stopTour = () => {
    const { cancelOnboarding } = this.props;

    cancelOnboarding();
    removeOverlay();
  };

  goToStep = (step: number) => {
    if (this.stepContainer && this.stepContainer.parentNode) {
      this.stepContainer.parentNode.removeChild(this.stepContainer);
    }

    this.setState({ step }, () => {
      if (!this.container.current) return;
      this.stepContainer = this.container.current.cloneNode(true);

      if (!document.body) return;
      document.body.appendChild(this.stepContainer);

      this.stepContainer.style.display = 'block';

      const prevButton = this.stepContainer.querySelector('button.prev');
      if (prevButton) {
        prevButton.addEventListener('click', () => this.goToStep(step - 1));
      }

      const nextButton = this.stepContainer.querySelector('button.next');
      if (nextButton) {
        nextButton.addEventListener('click', () => this.goToStep(step + 1));
      }

      if (step === 1) {
        const testContainer = this.testContainer();

        if (!testContainer) return;
        const testBoundingRects = testContainer.getBoundingClientRect();

        const containerBoundingRects = this.stepContainer.getBoundingClientRect();

        const offsetLeft = (testBoundingRects.width - containerBoundingRects.width) / 2;
        const left = testBoundingRects.left + offsetLeft;
        const top = testBoundingRects.bottom + 60;

        this.stepContainer.style.top = `${top}px`;
        this.stepContainer.style.left = `${left}px`;

        drawOverlayAround(testContainer, 70, 50, 40, 20);
      }

      if (step === 2) {
        const testContainer = this.testContainer();

        if (!testContainer) return;
        const variantSelector = testContainer.querySelector('.ab-test-for-wp__VariantSelector');

        if (!variantSelector) return;
        drawOverlayAround(variantSelector, 10, 10, 10, 10);
        const variantBoundingRects = variantSelector.getBoundingClientRect();

        const containerBoundingRects = this.stepContainer.getBoundingClientRect();

        const left = variantBoundingRects.left - containerBoundingRects.width - 60;
        const top = variantBoundingRects.top
          - containerBoundingRects.height;

        this.stepContainer.style.top = `${top}px`;
        this.stepContainer.style.left = `${left}px`;
      }

      if (step === 3) {
        const testContainer = this.testContainer();

        if (!testContainer) return;
        const variantSelector = testContainer.querySelector('.ab-test-for-wp__VariantSelector');

        if (!variantSelector) return;
        drawOverlayAround(variantSelector, 10, 10, 10, 10);
        const variantBoundingRects = variantSelector.getBoundingClientRect();

        const containerBoundingRects = this.stepContainer.getBoundingClientRect();

        const left = variantBoundingRects.left - containerBoundingRects.width - 60;
        const top = variantBoundingRects.top
          - containerBoundingRects.height
        + 60;

        this.stepContainer.style.top = `${top}px`;
        this.stepContainer.style.left = `${left}px`;
      }

      if (step === 4) {
        const sideBar = document.querySelector('.edit-post-sidebar');

        if (!sideBar) return;
        drawOverlayAround(sideBar);
        const sideBarRects = sideBar.getBoundingClientRect();

        const containerBoundingRects = this.stepContainer.getBoundingClientRect();

        const left = sideBarRects.left - containerBoundingRects.width - 60;
        const top = sideBarRects.top
          - (containerBoundingRects.height / 2)
          + (sideBarRects.height / 2);

        this.stepContainer.style.top = `${top}px`;
        this.stepContainer.style.left = `${left}px`;
      }
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

    if (step === 2) {
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
            <p>{__('Switch between editing variants here.')}</p>
          </div>
          <div className="buttons">
            <button type="button" className="prev">{__('Previous')}</button>
            <button type="button" className="next">{__('Next')}</button>
          </div>
        </div>
      );
    }

    if (step === 3) {
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
            <p>{__('Use the cog toggle the test options on the right.')}</p>
          </div>
          <div className="buttons">
            <button type="button" className="prev">{__('Previous')}</button>
            <button type="button" className="next">{__('Next')}</button>
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div ref={this.container} className="ab-testing-for-wp__Onboarding">
          <Arrow
            style={{
              position: 'absolute',
              right: -25,
              transform: 'rotate(35deg)',
              top: -60,
            }}
          />
          <div className="content">
            <p>{__('You can configure the test in this sidebar.')}</p>
          </div>
          <div className="buttons">
            <button type="button" className="prev">{__('Previous')}</button>
            <button type="button" className="next">{__('Next')}</button>
          </div>
        </div>
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
          <Button isPrimary onClick={() => this.goToStep(1)}>{__('Sure, start the tour!')}</Button>
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
