<?php

namespace ABTestingForWP;

class RegisterFrontendAdminBar {
    private $fileRoot;

    public function __construct($fileRoot) {
        $this->fileRoot = $fileRoot;

        $this->loadStyles();

        add_action('admin_bar_menu', [$this, 'addAdminBarMenu'], 90);
    }

    public function loadStyles() {
        wp_register_style('ab_testing_for_wp_frontend_style', plugins_url('/src/css/frontend.css', $this->fileRoot), []);
        wp_enqueue_style('ab_testing_for_wp_frontend_style');
    }

    public function addAdminBarMenu($wp_admin_bar) {
        $wp_admin_bar->add_menu([
            'id'    => 'ab-testing-for-wp',
            'title' => __('A/B Tests'),
        ]);
    }
}