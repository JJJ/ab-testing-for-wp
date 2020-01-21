declare const ABTestingForWP: {
  postId?: string;
  restUrl?: string;
};

declare const ABTestingForWP_AdminBar: {
  cookieData: {
    // test_id -> variant_id
    [id: string]: string;
  };
};

declare const ABTestingForWP_Data: {
  activeTests: ABTestAttributes[];
};

declare const ABTestingForWP_Options: any;

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
  postGoal: string;
  postGoalType: string;
  startedAt: Date | string;
  defaultContent?: any;
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
