<?php

namespace ABTestingForWP;

class BootStrapIntegrations {

    public function __construct() {
        add_action('init', [$this, 'loadIntegrations']);
    }

    public function loadIntegrations() {
        // Form plugins
        new HTMLForms();
        new ContactForm7();
        new MC4WP();
        new NinjaForms();
        new Formidable();
        new GravityForms();
        new WPForms();
    }

}