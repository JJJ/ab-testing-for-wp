<?php

namespace ABTestingForWP;

class GravityForms extends Integration {

    protected $pluginSlug = 'gravityforms/gravityforms.php';

    protected function extraPluginCheck() {
        // check if code is really loaded
        return class_exists('GFForms');
    }

    protected function loadIntegration() {
        add_filter('ab-testing-for-wp_goal-types', [$this, 'addGoalType']);
        add_action('gform_after_submission', [$this, 'catchFormSubmits']);

        $this->addCustomQuery(
            'GravityForms',
            "SELECT id, title FROM %sgf_form ORDER BY date_updated, date_created DESC",
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
                'name' => 'GravityForms',
                'label' => 'Gravity Forms',
                'itemName' => __('On submit of form', 'ab-testing-for-wp'),
                'help' => __('If the visitor submits this form it will add a point to the tested variant.', 'ab-testing-for-wp')
            ]
        );

        return $types;
    }

    public function catchFormSubmits($entry) {
        $formId = $entry['form_id'];
        $abTestTracking = new ABTestTracking();

        $abTestTracking->trackGoal($formId, 'GravityForms');
    }

}
