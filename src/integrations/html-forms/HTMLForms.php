<?php

namespace ABTestingForWP;

class HTMLForms extends Integration {

    protected $pluginSlug = 'html-forms/html-forms.php';

    protected function loadIntegration() {
        add_filter('ab-testing-for-wp_goal-types', [$this, 'addGoalType']);
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

}