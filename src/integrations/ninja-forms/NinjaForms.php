<?php

namespace ABTestingForWP;

class NinjaForms extends Integration {

    protected $pluginSlug = 'ninja-forms/ninja-forms.php';

    protected function extraPluginCheck() {
        // check if code is really loaded
        return class_exists('Ninja_Forms');
    }

    protected function loadIntegration() {
        add_filter('ab-testing-for-wp_goal-types', [$this, 'addGoalType']);
        // add_action('wpcf7_submit', [$this, 'catchFormSubmits']);

        $this->addCustomQuery(
            'NinjaForms',
            "SELECT id, title FROM wp_nf3_forms ORDER BY updated_at DESC",
            function ($item) {
                return [
                    'ID' => $item->id,
                    'post_title' => $item->title,
                ];
            }
        );
    }
    
    public function addGoalType($types) {
        array_push(
            $types, 
            [ 
                'name' => 'NinjaForms', 
                'label' => 'Ninja Forms',
                'itemName' => 'On submit of form',
                'help' => 'If the visitor submits this form it will add a point to the tested variant.'
            ]
        );

        return $types;
    }

    public function catchFormSubmits($form) {
        $formId = $form->id();
        $abTestTracking = new ABTestTracking();

        $abTestTracking->trackPostId($formId);
    }

}