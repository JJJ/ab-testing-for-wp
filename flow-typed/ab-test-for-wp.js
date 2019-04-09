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
  postGoalType: string;
  startedAt: Date | string;
};

declare type GutenbergProps = {
  clientId: string;
  setAttributes: (newState: any) => void;
};

declare type ABTestResult = {
  id: string;
  name: string;
  participants: number;
  conversions: number;
};
