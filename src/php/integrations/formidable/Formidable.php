<?php

namespace ABTestingForWP;

class Formidable extends Integration {

    protected $pluginSlug = 'formidable/formidable.php';

    protected function extraPluginCheck() {
        // check if code is really loaded
        return function_exists('load_formidable_forms');
    }

    protected function loadIntegration() {
        add_filter('ab-testing-for-wp_goal-types', [$this, 'addGoalType']);
        add_action('frm_after_create_entry', [$this, 'catchFormSubmits'], 10, 2);

        $this->addCustomQuery(
            'Formidable',
            "SELECT id, name FROM %sfrm_forms ORDER BY created_at DESC",
            function ($item) {
                return [
                    'ID' => $item->id,
                    'post_title' => $item->name,
                ];
            }
        );
    }

    public function addGoalType($types) {
        array_push(
            $types,
            [
                'name' => 'Formidable',
                'label' => 'Formidable',
                'itemName' => __('On submit of form', 'ab-testing-for-wp'),
                'help' => __('If the visitor submits this form it will add a point to the tested variant.', 'ab-testing-for-wp')
            ]
        );

        return $types;
    }

    public function catchFormSubmits($entry_id, $formId) {
        $abTestTracking = new ABTestTracking();
        $abTestTracking->trackGoal($formId, 'Formidable');
    }

}
