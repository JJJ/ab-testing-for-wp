<?php

namespace ABTestingForWP;

class WPForms extends Integration {

    protected $pluginSlug = 'wpforms-lite/wpforms.php';

    protected function extraPluginCheck() {
        // check if code is really loaded
        return defined('WPFORMS_VERSION');
    }

    protected function loadIntegration() {
        add_filter('ab-testing-for-wp_goal-types', [$this, 'addGoalType']);
        add_action('wpforms_process_complete', [$this, 'catchFormSubmits'], 10, 3);
    }
    
    public function addGoalType($types) {
        array_push(
            $types, 
            [ 
                'name' => 'wpforms', 
                'label' => 'WPForms',
                'itemName' => __('On submit of form'),
                'help' => __('If the visitor submits this form it will add a point to the tested variant.')
            ]
        );

        return $types;
    }

    public function catchFormSubmits($fields, $entry, $form) {
        $formId = $form['id'];
        $abTestTracking = new ABTestTracking();

        $abTestTracking->trackPostId($formId, 'wpforms');
    }

}