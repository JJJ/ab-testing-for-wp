<?php

namespace ABTestingForWP;

class RegisterRenderScripts {

    public function __construct() {
        wp_register_script(
            'ab-testing-for-wp_cookies', 
            plugins_url( '../dist/cookies.js', __FILE__ ), 
            ['wp-api-fetch']
        );
        wp_enqueue_script('ab-testing-for-wp_cookies');
    }
    
}