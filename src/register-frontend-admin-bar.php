<?php

namespace ABTestingForWP;

class RegisterFrontendAdminBar {
    private $fileRoot;
    private $abTestManager;

    public function __construct($fileRoot) {
        $this->fileRoot = $fileRoot;
        $this->abTestManager = new ABTestManager();
        
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

        wp_register_script('ab-testing-for-wp-admin-bar', plugins_url('/dist/admin-bar.js', $this->fileRoot), []);
        wp_localize_script(
            'ab-testing-for-wp-admin-bar', 
            'ABTestingForWP_AdminBar', 
            [
                'testsData' => $testsData,
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
            'title' => sprintf(__('A/B Tests (%d)'), sizeof($testsData)),
        ]);

        if (sizeof($testsData) === 0) {
            $wp_admin_bar->add_node([
                'id' => 'ab-testing-for-wp_no-content',
                'title' => __('No tests found on this page'),
                'parent' => 'ab-testing-for-wp',
            ]);

            return;
        }

        foreach ($testsData as $key => $testData) {
            $id = 'ab-testing-for-wp_' . $testData['id'];

            $wp_admin_bar->add_node([
                'id' => $id,
                'title' => sprintf(__('Test %s'), $key + 1),
                'parent' => 'ab-testing-for-wp',
                'meta' => [
                    'class' => 'ab-testing-for-wp__test',
                ]
            ]);

            foreach ($testData['variants'] as $variant) {
                $wp_admin_bar->add_node([
                    'id' => 'ab-testing-for-wp_' . $variant['id'],
                    'title' => $variant['name'],
                    'parent' => $id,
                    'meta' => [
                        'class' => 'ab-testing-for-wp__variant',
                    ]
                ]);
            }
        }
    }
}