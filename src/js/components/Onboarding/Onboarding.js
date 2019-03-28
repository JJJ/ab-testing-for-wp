// @flow @jsx wp.element.createElement

import { Component } from 'react';

type OnboardingProps = {
  clientId: string;
};

class Onboarding extends Component<*> {
  componentDidMount() {
    const { clientId } = this.props;

    // type(pin): "SELECT_BLOCK"
    // initialPosition(pin): null
    // clientId(pin): "31ea84cd-dfff-48c1-8b47-48d766f6be11"
  }

  render() {
    return <div>Test</div>;
  }
}

export default Onboarding;
