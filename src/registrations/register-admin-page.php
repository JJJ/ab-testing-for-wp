<?php

namespace ABTestingForWP;

class RegisterAdminPage {
    private $abTestMananger;
    private $fileRoot;
    private $srcRoot = __DIR__ . '/../';

    public function __construct($fileRoot) {
        $this->abTestManager = new ABTestManager();
        $this->fileRoot = $fileRoot;

        add_action('admin_menu', [$this, 'menu']);
        add_action('current_screen', [$this, 'screenLoad']);
    }

    public function screenLoad() {
        $screen = get_current_screen();
        $base = 'a-b-testing_page_ab-testing-for-wp';
        $toplevelBase = 'toplevel_page_ab-testing-for-wp';

        if (substr($screen->id, 0, strlen($base)) === $base || $screen->id === $toplevelBase) {
            // an A/B Testing for WordPress admin page
            $this->loadStyles();
            $this->loadScripts($this->getPageData($screen->id));
        }
    }

    private function loadStyles() {
        wp_register_style('ab_testing_for_wp_admin_style', plugins_url('/src/css/admin.css', $this->fileRoot), []);
        wp_enqueue_style('ab_testing_for_wp_admin_style');
    }

    private function loadScripts($data = null) {
        wp_register_script(
            'ab-testing-for-wp-admin', 
            plugins_url('/dist/admin.js', $this->fileRoot), 
            ['wp-api-fetch', 'wp-element']
        );

        if (isset($data)) {
            wp_localize_script(
                'ab-testing-for-wp-admin', 
                'ABTestingForWP_Data', 
                $data
            );
        }

        wp_enqueue_script('ab-testing-for-wp-admin');
    }

    private function getPageData($pageName) {
        $base = 'a-b-testing_page_ab-testing-for-wp';
        $toplevelBase = 'toplevel_page_ab-testing-for-wp';

        $pageName = str_replace($base, '', $pageName);
        $pageName = str_replace($toplevelBase, '', $pageName);

        switch ($pageName) {
            case '':
                return $this->overviewData();
            default:
                return [];
        }
    }

    public function menu() {
        $icon = file_get_contents($this->srcRoot . 'assets/ab-testing-for-wp-base64-logo.svg');

        add_menu_page(
            'A/B Testing',
            'A/B Testing', 
            'manage_options',
            'ab-testing-for-wp', 
            [$this, 'appContainer'], 
            $icon, 
            61
        );

        add_submenu_page( 
            'ab-testing-for-wp',
            __('Active A/B Tests Overview'),
            __('All A/B Tests'), 
            'manage_options', 
            'ab-testing-for-wp',
            [$this, 'appContainer']
        );

        add_submenu_page( 
            'ab-testing-for-wp',
            __('Add New A/B Test'),
            __('Add New A/B Test'), 
            'manage_options', 
            'post-new.php?post_type=abt4wp-test',
            [$this, 'gotoEditor']
        );

        // post-new.php?post_type=abt4wp-test

        add_submenu_page( 
            'ab-testing-for-wp',
            __('How to Use A/B Testing'),
            __('How to Use'), 
            'manage_options', 
            'ab-testing-for-wp_howto',
            [$this, 'howto']
        );
    }

    public function appContainer() {
        echo "<div id='admin_app'></div>";
    }

    public function gotoEditor() {
        echo "<script>window.location = \"" . admin_url('/post-new.php?post_type=abt4wp-test') . "\";</script>";
    }

    private function overviewData() {
        $testsData = $this->abTestManager->getAllTests();

        $testsData = array_map(
            function ($test) {
                $test['startedAt'] = strtotime($test['startedAt']) * 1000;

                if ($test['postGoal'] === '0') {
                    $test['goalName'] = '—';
                }

                return $test;
            },
            $testsData
        );

        return [
            'activeTests' => $testsData,
        ];
    }

    public function howto() {
        $assets = plugins_url('/src/assets/', $this->fileRoot);

        require $this->srcRoot . 'pages/howto.php';
    }

}