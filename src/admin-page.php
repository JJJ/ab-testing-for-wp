<?php

namespace ABTestingForWP;

class AdminPage {
    private $abTestMananger;

    public function __construct($fileRoot) {
        $this->abTestManager = new ABTestManager();

        $this->loadStyles($fileRoot);

        add_action('admin_menu', [$this, 'menu']);
    }

    public function loadStyles($fileRoot) {
        wp_register_style('ab_testing_for_wp_admin_style', plugins_url('/src/css/admin.css', $fileRoot), []);
        wp_enqueue_style('ab_testing_for_wp_admin_style');
    }

    public function menu() {
        $icon = file_get_contents(__DIR__ . '/assets/ab-testing-for-wp-base64-logo.svg');

        add_menu_page(
            'A/B Testing',
            'A/B Testing', 
            'manage_options',
            'ab-testing-for-wp', 
            [$this, 'settingsPage'], 
            $icon, 
            61
        );
    }

    public function settingsPage() {
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

                return $test;
            },
            $testsData
        );

        $templateData = [
            'activeTests' => $testsData,
        ];

        require __DIR__ . '/pages/admin.php';
    }

}