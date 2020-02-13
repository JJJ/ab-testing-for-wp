declare const ABTestingForWP: {
  postId?: string;
  restUrl?: string;
  // actually a boolean, but WordPress return "" for `false` and "1" for `true`
  notAdmin?: string;
};

declare const ABTestingForWP_AdminBar: {
  participating: {
    // test_id: variant_id
    [id: string]: string;
  };
};

interface AbTestingForWpData {
  activeTests: TestData[];
}

declare const ABTestingForWP_Data: AbTestingForWpData;

interface AbTestingForWpOptions {
  completeOnboarding: string;
  lastMigration: string;
}

declare const ABTestingForWP_Options: AbTestingForWpOptions;

interface ABTestVariantCondition {
  key: string;
  value: string;
}

declare interface ABTestVariant {
  id: string;
  name: string;
  selected: boolean;
  distribution: number;
  defaultContent?: any;
  conditions: ABTestVariantCondition[];
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
  conditions: ABTestVariantCondition[];
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
  postGoalType: string;
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
