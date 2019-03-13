declare var wp: any;

declare type ABTestVariant = {
  id: string;
  name: string;
  selected: boolean;
  distribution: number;
};

declare type GutenbergProps = {
  setAttributes: (newState: any) => void;
};
