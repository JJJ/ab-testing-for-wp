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
  completedOnboarding: boolean;
  postGoal: number;
  startedAt: Date | string;
};

declare type GutenbergProps = {
  clientId: string;
  setAttributes: (newState: any) => void;
};
