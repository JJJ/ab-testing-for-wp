// @flow @jsx wp.element.createElement

import { components } from '../../gutenberg';

import './TestSelector.css';

const {
  ButtonGroup,
  IconButton,
} = components;

type TestSelectorProps = {
  tests: ABTest[];
  onSelectTest: (id: string) => void;
}

function TestSelector({ tests, onSelectTest }: TestSelectorProps) {
  return (
    <div className="ab-test-for-wp__TestSelector">
      <ButtonGroup>
        {tests.map(test => (
          <IconButton
            isToggled={test.selected}
            onClick={() => onSelectTest(test.id)}
          >
            {test.name}
          </IconButton>
        ))}
        <IconButton icon="ellipsis" />
      </ButtonGroup>
    </div>
  );
}

export default TestSelector;
