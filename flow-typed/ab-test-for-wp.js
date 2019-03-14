declare var wp: any;
declare var ABTestingForWP: {
  postId?: string;
};

declare type ABTestVariant = {
  id: string;
  name: string;
  selected: boolean;
  distribution: number;
};

declare type ABTestAttributes = {
  id: string;
  variants: ABTestVariant[];
  control: string;
  isEnabled: boolean;
  postGoal: number;
};

declare type GutenbergProps = {
  setAttributes: (newState: any) => void;
};
