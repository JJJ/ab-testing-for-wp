<?php

namespace ABTestingForWP;

class GoalActions {

    public function getGoalTypes() {
        do_action('ab-testing-for-wp_rest_init');

        $types = get_post_types(
            [
                'public' => true,
            ], 
            'objects'
        );

        $allowedTypes = [];

        $strings = [
            'post' => [
                'itemName' => __('Post'),
                'help' => __('Goal post for this test. If the visitor lands on this post it will add a point to the tested variant.'),
            ],
            'page' => [
                'itemName' => __('Page'),
                'help' => __('Goal page for this test. If the visitor lands on this page it will add a point to the tested variant.'),
            ],
        ];

        foreach ($types as $key => $type) {
            // only allow posts and pages
            if ($key !== 'post' && $key !== 'page') continue;
            array_push($allowedTypes, array_merge(['name' => $type->name, 'label' => $type->label], $strings[$key]));
        }

        $allowedTypes = apply_filters('ab-testing-for-wp_goal-types', $allowedTypes); 

        return rest_ensure_response($allowedTypes);
    }

}