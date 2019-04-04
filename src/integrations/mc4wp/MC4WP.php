<?php

namespace ABTestingForWP;

class MC4WP extends Integration {

    protected $pluginSlug = 'mailchimp-for-wp/mailchimp-for-wp.php';

    protected function extraPluginCheck() {
        // check if code is really loaded
        return function_exists('_mc4wp_load_plugin');
    }

    protected function loadIntegration() {
        add_filter('ab-testing-for-wp_goal-types', [$this, 'addGoalType']);
        add_action('mc4wp_form_success', [$this, 'catchFormSubmits']);
    }
    
    public function addGoalType($types) {
        array_push(
            $types, 
            [ 
                'name' => 'mc4wp-form', 
                'label' => 'Mailchimp for WordPress',
                'itemName' => 'On signup',
                'help' => 'If the visitor signs up for your newsletter it will add a point to the tested variant.'
            ]
        );

        return $types;
    }

    public function catchFormSubmits($form) {
        $formId = $form->ID;
        $abTestTracking = new ABTestTracking();

        $abTestTracking->trackPostId($formId);
    }

}