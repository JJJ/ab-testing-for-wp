declare const ABTestingForWP: {
  postId?: string;
};

declare interface ABTestVariant {
  id: string;
  name: string;
  selected: boolean;
  distribution: number;
  defaultContent?: any;
}

declare interface ABTestAttributes {
  id: string;
  variants: ABTestVariant[];
  title: string;
  control: string;
  isEnabled: boolean;
  completedOnboarding: boolean;
  postGoal: number;
  postGoalType: string;
  startedAt: Date | string;
  defaultContent?: any;
}

declare interface GutenbergProps {
  clientId: string;
  setAttributes: (newState: any) => void;
}

declare interface ABTestResult {
  id: string;
  name: string;
  participants: number;
  conversions: number;
}

declare interface TestVariant {
  id: string;
  conversions: number;
  participants: number;
  leading: boolean;
  name: string;
  rate: number;
  uplift: number;
}

declare interface TestData {
  id: string;
  control: string;
  title: string;
  goalName: string;
  goalType: string;
  goalLink?: string;
  postId: string;
  postGoal: string;
  postType: string;
  postName: string;
  postLink?: string;
  postDeleteLink?: string;
  startedAt: number;
  totalParticipants: number;
  isArchived: string;
  isEnabled: boolean;
  variants: TestVariant[];
}
