<?php

namespace ABTestingForWP;

class RegisterAdminPage {
    private $abTestMananger;
    private $fileRoot;
    private $srcRoot = __DIR__ . '/../';

    public function __construct($fileRoot) {
        $this->abTestManager = new ABTestManager();
        $this->fileRoot = $fileRoot;

        $this->loadStyles();

        add_action('admin_menu', [$this, 'menu']);
    }

    private function loadStyles() {
        wp_register_style('ab_testing_for_wp_admin_style', plugins_url('/src/css/admin.css', $this->fileRoot), []);
        wp_enqueue_style('ab_testing_for_wp_admin_style');
    }

    public function menu() {
        $icon = file_get_contents($this->srcRoot . 'assets/ab-testing-for-wp-base64-logo.svg');

        add_menu_page(
            'A/B Testing',
            'A/B Testing', 
            'manage_options',
            'ab-testing-for-wp', 
            [$this, 'overview'], 
            $icon, 
            61
        );

        add_submenu_page( 
            'ab-testing-for-wp',
            __('Active A/B Tests Overview'),
            __('All A/B Tests'), 
            'manage_options', 
            'ab-testing-for-wp',
            [$this, 'overview']
        );

        add_submenu_page( 
            'ab-testing-for-wp',
            __('How to Use A/B Testing'),
            __('How to Use'), 
            'manage_options', 
            'ab-testing-for-wp_howto',
            [$this, 'howto']
        );
    }

    public function overview() {
        $testsData = $this->abTestManager->getAllTests();

        $testsData = array_map(
            function ($test) {
                $timeStamp = strtotime($test['startedAt']);

                if ($timeStamp < 0) {
                    $test['startedAt'] = '—';
                } else {
                    $time = strtotime($test['startedAt']);
                    $date = date(__('Y/m/d'), $time);
                    $days = round((time() - $time) / (60 * 60 * 24));
                    $test['startedAt'] = sprintf(_n('%s (%d day)', '%s (%d days)', $days), $date, $days);
                }

                if ($test['postGoal'] === '0') {
                    $test['goalName'] = '—';
                }

                return $test;
            },
            $testsData
        );

        $templateData = [
            'activeTests' => $testsData,
        ];

        require $this->srcRoot . 'pages/overview.php';
    }

    public function howto() {
        $assets = plugins_url('/src/assets/', $this->fileRoot);

        require $this->srcRoot . 'pages/howto.php';
    }

}