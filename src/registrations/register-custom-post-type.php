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
                    'name' => __('A/B Tests'),
                    'singular_name' => __('A/B Test'),
                    'add_new' => __('Add New'),
                    'add_new_item' => __('Add New A/B Test'),
                    'edit_item' => __('Edit A/B Test'),
                    'new_item' => __('New A/B Test'),
                    'view_item' => __('View A/B Test'),
                    'view_items' => __('View A/B Tests'),
                    'all_items' => __('All A/B Tests'),
                ],
                'description' => __('A/B Test created with A/B Testing for WordPress.'),
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