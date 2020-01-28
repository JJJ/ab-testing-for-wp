<?php

namespace ABTestingForWP;

class RegisterCustomPostType {

    public function __construct() {
        add_action('init', [$this, 'registerTestType']);
    }

    public function registerTestType() {
        register_post_type(
            'abt4wp-test',
            [
                'labels' => [
                    'name' => __('A/B Tests', 'ab-testing-for-wp'),
                    'singular_name' => __('A/B Test', 'ab-testing-for-wp'),
                    'add_new' => __('Add New', 'ab-testing-for-wp'),
                    'add_new_item' => __('Add New A/B Test', 'ab-testing-for-wp'),
                    'edit_item' => __('Edit A/B Test', 'ab-testing-for-wp'),
                    'new_item' => __('New A/B Test', 'ab-testing-for-wp'),
                    'view_item' => __('View A/B Test', 'ab-testing-for-wp'),
                    'view_items' => __('View A/B Tests', 'ab-testing-for-wp'),
                    'all_items' => __('All A/B Tests', 'ab-testing-for-wp'),
                ],
                'description' => __('A/B Test created with A/B Testing for WordPress.', 'ab-testing-for-wp'),
                'public' => true,
                'publicly_queryable' => false,
                'exclude_from_search' => true,
                'show_ui' => true,
                'show_in_menu' => false,
                'show_in_admin_bar' => true,
                'show_in_rest' => true,
                'template' => [
                    ['ab-testing-for-wp/ab-test-block', []],
                ],
                'template_lock' => 'insert',
            ]
        );
    }

}
