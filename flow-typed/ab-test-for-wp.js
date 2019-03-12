declare type ABTest = {
  id: string;
  name: string;
  selected: boolean;
};

declare type GutenbergProps = {
  setAttributes: (newState: any) => void;
};
