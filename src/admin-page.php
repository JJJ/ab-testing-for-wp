<?php

namespace ABTestingForWP;

class AdminPage {
    private $abTestMananger;

    public function __construct($fileRoot) {
        $this->abTestManager = new ABTestManager();

        add_action('admin_menu', [$this, 'menu']);   
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
                    $test['startedAt'] = date(__('Y/m/d'), strtotime($test['startedAt']));
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