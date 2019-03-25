<?php

namespace ABTestingForWP;

class RegisterFrontendAdminBar {
    private $fileRoot;

    public function __construct($fileRoot) {
        $this->fileRoot = $fileRoot;

        add_action('admin_bar_menu', [$this, 'addAdminBarMenu']);
    }

    public function addAdminBarMenu($wp_admin_bar) {
        $wp_admin_bar->add_menu([
            'id'    => 'ab-testing-for-wp',
            'title' => __('A/B Tests'),
        ]);
    }
}