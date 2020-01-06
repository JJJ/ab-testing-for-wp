import React, { Component } from 'react';

import { __, sprintf } from '@wordpress/i18n';
import {
  Modal,
  Button,
  RadioControl,
} from '@wordpress/components';

interface DeclareWinnerProps {
  variants: {
    id: string;
    name: string;
    rate: number;
    winner: boolean;
    participants: number;
    conversions: number;
    control: boolean;
    uplift: number;
  }[];
  onDeclareWinner: (id: string) => void;
}

interface DeclareWinnerState {
  isOpen: boolean;
  confirm: boolean;
  value: string;
}

class DeclareWinner extends Component<DeclareWinnerProps, DeclareWinnerState> {
  constructor(props: DeclareWinnerProps) {
    super(props);

    this.state = {
      isOpen: false,
      confirm: false,
      value: '',
    };
  }

  openModal = (): void => this.setState({
    isOpen: true,
    confirm: false,
    value: '',
  });

  closeModal = (): void => this.setState({ isOpen: false });

  toConfirm = (): void => this.setState({ confirm: true });

  render(): React.ReactElement {
    const { variants, onDeclareWinner } = this.props;
    const { isOpen, confirm, value } = this.state;

    const selectedValue = value !== ''
      ? value : (variants.find((variant) => variant.winner) || { id: '' }).id;
    const selectedVariant = (variants.find((variant) => variant.id === selectedValue)
      || { name: '' });

    return (
      <div>
        <Button isLink onClick={this.openModal}>
          {__('Declare a winner')}
        </Button>
        {isOpen && !confirm && (
          <Modal title={__('Declare a winner')} onRequestClose={this.closeModal}>
            <p>
              {__('Which variant do you want to declare a winner?')}
            </p>
            <RadioControl
              selected={selectedValue}
              options={variants.map((variant) => ({
                label: sprintf(__('%s — %d%% %s'), variant.name, variant.rate, variant.winner ? __('(winner)') : ''),
                value: variant.id,
              }))}
              onChange={(newValue): void => this.setState({ value: newValue || '' })}
            />
            <div style={{ marginTop: '1em' }}>
              <Button isLarge isPrimary onClick={this.toConfirm}>
                {__('Declare winner')}
              </Button>
            </div>
          </Modal>
        )}

        {isOpen && confirm && (
          <Modal title={__('Are you sure?')} onRequestClose={this.closeModal}>
            <p>
              {sprintf(__('Do you want to declare variant "%s" as the winner?'), selectedVariant.name)}
            </p>
            <p>
              {__('This will remove the test and place the winning variant in its place.')}
            </p>
            <p>
              <strong>{__('The test will be removed!')}</strong>
            </p>
            <div style={{ marginTop: '1.5em' }}>
              <Button
                isLarge
                isPrimary
                style={{ marginRight: 4 }}
                onClick={() => {
                  onDeclareWinner(selectedValue);
                  this.closeModal();
                }}
              >
                {sprintf(__('Yes, "%s" is the winner'), selectedVariant.name)}
              </Button>
              <Button isLarge isDefault onClick={this.closeModal}>
                {__('No. Cancel')}
              </Button>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default DeclareWinner;
