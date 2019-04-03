<?php

namespace ABTestingForWP;

class HTMLForms extends Integration {

    protected $pluginSlug = 'html-forms/html-forms.php';

    protected function loadIntegration() {
        add_filter('ab-testing-for-wp_goal-types', [$this, 'addGoalType']);
        add_action('hf_process_form', [$this, 'catchFormSubmits']);
    }
    
    public function addGoalType($types) {
        return array_merge(
            $types,
            [
                [ 
                    'name' => 'html-form', 
                    'label' => 'HTML Forms',
                    'itemName' => 'On submit of form',
                    'help' => 'If the visitor submits this form it will add a point to the tested variant.'
                ]
            ]
        );
    }

    public function catchFormSubmits($form) {
        var_dump($form);
        die();
    }

}