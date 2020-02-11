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
        add_action('ninja_forms_after_submission', [$this, 'catchFormSubmits']);

        $this->addCustomQuery(
            'NinjaForms',
            "SELECT id, title FROM %snf3_forms ORDER BY updated_at DESC",
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
                'itemName' => __('On submit of form', 'ab-testing-for-wp'),
                'help' => __('If the visitor submits this form it will add a point to the tested variant.', 'ab-testing-for-wp')
            ]
        );

        return $types;
    }

    public function catchFormSubmits($submission) {
        $formId = $submission["form_id"];
        $abTestTracking = new ABTestTracking();

        $abTestTracking->trackGoal($formId, 'NinjaForms');
    }

}
