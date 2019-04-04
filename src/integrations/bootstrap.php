<?php

namespace ABTestingForWP;

class BootStrapIntegrations {

    public function __construct() {
        add_action('init', [$this, 'loadIntegrations']);
    }

    public function loadIntegrations() {
        // Contact form plugins
        new HTMLForms();
        new ContactForm7();
    }

}