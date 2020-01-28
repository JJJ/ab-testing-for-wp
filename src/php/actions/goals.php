<?php

namespace ABTestingForWP;

class GoalActions {

    private function addTypeToList($input, $type, $strings) {
        array_push($input, array_merge(['name' => $type->name, 'label' => $type->label], $strings));
        return $input;
    }

    public function getGoalTypes() {
        $types = get_post_types(
            [
                'public' => true,
            ],
            'objects'
        );

        $allowedTypes = [];

        $strings = [
            'post' => [
                'itemName' => __('Post', 'ab-testing-for-wp'),
                'help' => __('Goal post for this test. If the visitor lands on this post it will add a point to the tested variant.', 'ab-testing-for-wp'),
            ],
            'page' => [
                'itemName' => __('Page', 'ab-testing-for-wp'),
                'help' => __('Goal page for this test. If the visitor lands on this page it will add a point to the tested variant.', 'ab-testing-for-wp'),
            ],
        ];

        foreach ($types as $key => $type) {
            // only allow posts and pages
            if ($key !== 'post' && $key !== 'page') continue;
            array_push($allowedTypes, array_merge(['name' => $type->name, 'label' => $type->label], $strings[$key]));
        }

        array_push($allowedTypes, [
            'name' => 'outbound',
            'label' => __('Outbound link', 'ab-testing-for-wp'),
            'itemName' => __('Visitor goes to', 'ab-testing-for-wp'),
            'help' => __('If visitor goes to this link, it will add a point for the tested variant.', 'ab-testing-for-wp'),
            'placeholder' => __('https://', 'ab-testing-for-wp'),
            'text' => true,
        ]);

        $allowedTypes = apply_filters('ab-testing-for-wp_goal-types', $allowedTypes);

        return rest_ensure_response($allowedTypes);
    }

}
