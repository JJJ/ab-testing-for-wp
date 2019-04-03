<?php

namespace ABTestingForWP;

class BootStrapIntegrations {

    public function __construct() {
        add_action('admin_init', [$this, 'loadIntegrations']);
    }

    public function loadIntegrations() {
        new HTMLForms();
    }

}