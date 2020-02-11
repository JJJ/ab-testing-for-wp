<?php

namespace ABTestingForWP;

class ContactForm7 extends Integration {

    protected $pluginSlug = 'contact-form-7/wp-contact-form-7.php';

    protected function extraPluginCheck() {
        // check if code is really loaded
        return defined('WPCF7_VERSION');
    }

    protected function loadIntegration() {
        add_filter('ab-testing-for-wp_goal-types', [$this, 'addGoalType']);
        add_action('wpcf7_submit', [$this, 'catchFormSubmits']);
    }

    public function addGoalType($types) {
        array_push(
            $types,
            [
                'name' => 'wpcf7_contact_form',
                'label' => 'Contact Form 7',
                'itemName' => __('On submit of form', 'ab-testing-for-wp'),
                'help' => __('If the visitor submits this form it will add a point to the tested variant.', 'ab-testing-for-wp')
            ]
        );

        return $types;
    }

    public function catchFormSubmits($form) {
        $formId = $form->id();
        $abTestTracking = new ABTestTracking();

        $abTestTracking->trackGoal($formId, 'wpcf7_contact_form');
    }

}
