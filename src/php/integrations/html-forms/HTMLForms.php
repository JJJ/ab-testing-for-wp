<?php

namespace ABTestingForWP;

class HTMLForms extends Integration {

    protected $pluginSlug = 'html-forms/html-forms.php';

    protected function extraPluginCheck() {
        // check if code is really loaded
        return function_exists('HTML_Forms\\_bootstrap');
    }

    protected function loadIntegration() {
        add_filter('ab-testing-for-wp_goal-types', [$this, 'addGoalType']);
        add_action('hf_form_success', [$this, 'catchFormSubmits']);
    }

    public function addGoalType($types) {
        array_push(
            $types,
            [
                'name' => 'html-form',
                'label' => 'HTML Forms',
                'itemName' => __('On submit of form', 'ab-testing-for-wp'),
                'help' => __('If the visitor submits this form it will add a point to the tested variant.', 'ab-testing-for-wp')
            ]
        );

        return $types;
    }

    public function catchFormSubmits($submission) {
        $formId = $submission->form_id;
        $abTestTracking = new ABTestTracking();

        $abTestTracking->trackGoal($formId, 'html-form');
    }

}
