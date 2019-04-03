<?php

namespace ABTestingForWP;

class BootStrapIntegrations {

    public function __construct() {
        add_action('admin_init', [$this, 'loadIntegrations']);
        add_action('ab-testing-for-wp_rest_init', [$this, 'loadIntegrations']);
    }

    public function loadIntegrations() {
        new HTMLForms();
    }

}