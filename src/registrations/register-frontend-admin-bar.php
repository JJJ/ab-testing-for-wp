<?php

namespace ABTestingForWP;

class RegisterFrontendAdminBar {
    private $fileRoot;
    private $abTestManager;

    public function __construct($fileRoot) {
        $this->fileRoot = $fileRoot;
        $this->abTestManager = new ABTestManager();
        
        add_action('init', [$this, 'bootstrap']);
    }
    
    public function bootstrap() {
        if (is_admin_bar_showing()) {
            add_action('wp_enqueue_scripts', [$this, 'loadAssets']);
            add_action('admin_bar_menu', [$this, 'addAdminBarMenu'], 90);
        }
    }

    public function loadAssets() {
        $postId = get_the_ID();
        $testsData = $this->abTestManager->getTestDataByPost($postId);

        wp_register_style('ab_testing_for_wp_admin_bar_style', plugins_url('/src/css/admin-bar.css', $this->fileRoot), []);
        wp_enqueue_style('ab_testing_for_wp_admin_bar_style');

        wp_register_script(
            'ab-testing-for-wp-admin-bar', 
            plugins_url('/dist/admin-bar.js', $this->fileRoot), 
            ['wp-api-fetch']
        );
        wp_localize_script(
            'ab-testing-for-wp-admin-bar', 
            'ABTestingForWP_AdminBar', 
            [
                'cookieData' => isset($_COOKIE['ab-testing-for-wp']) ? json_decode(stripslashes($_COOKIE['ab-testing-for-wp']), true) : [],
            ]
        );
        wp_enqueue_script('ab-testing-for-wp-admin-bar');
    }

    public function addAdminBarMenu($wp_admin_bar) {
        $postId = get_the_ID();
        $testsData = $this->abTestManager->getTestDataByPost($postId);

        $wp_admin_bar->add_menu([
            'id' => 'ab-testing-for-wp',
            'title' => __('A/B Tests'),
        ]);

        $wp_admin_bar->add_node([
            'id' => 'ab-testing-for-wp_loading',
            'title' => __('Scanning tests on page'),
            'parent' => 'ab-testing-for-wp',
        ]);
    }
}