// @flow @jsx wp.element.createElement

import { Component } from 'react';

import { data, components, i18n } from '../../WP';

import './Onboarding.css';

const { __ } = i18n;
const { withDispatch } = data;
const { Modal, Button } = components;

type OnboardingProps = {
  clientId: string;
  selectBlock: (clientId: string) => void;
  cancelOnboarding: () => void;
};

class Onboarding extends Component<OnboardingProps> {
  componentDidMount() {
    const { clientId, selectBlock } = this.props;

    setTimeout(() => selectBlock(clientId), 0);
  }

  render() {
    const { cancelOnboarding } = this.props;

    return (
      <Modal
        title={__('Welcome to A/B Testing for WordPress!')}
        className="ab-testing-for-wp__OnboardingModal"
        onRequestClose={cancelOnboarding}
      >
        <p>
          {__('Looks like this is your first time using A/B Testing for WordPress.')}
        </p>
        <p>
          {__('Would you like a quick tour on how to setup a test?')}
        </p>
        <div className="ButtonContainer">
          <Button isPrimary>{__('Sure, start the tour!')}</Button>
          <Button isLink onClick={cancelOnboarding}>{__('No thanks')}</Button>
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
