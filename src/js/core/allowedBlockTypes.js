// @flow

import { blocks } from '../wp';

const defaultDisallowed = [
  'ab-testing-for-wp/ab-test-block',
  'ab-testing-for-wp/ab-test-block-variant',
];

export default function allowedBlockTypes(disallowedTypes: string[] = defaultDisallowed) {
  return blocks.getBlockTypes()
    .map(type => type.name)
    .filter(typeName => disallowedTypes.indexOf(typeName) === -1);
}
