<?php

namespace ABTestingForWP;

require __DIR__ . '/ab-test-content-parser.php';
require __DIR__ . '/block-renderer.php';
require __DIR__ . '/register-gutenberg-blocks.php';
require __DIR__ . '/register-render-scripts.php';
require __DIR__ . '/register-rest.php';

function bootstrap() {
    if(!is_admin()) {
        new RegisterRenderScripts();
    }

    new RegisterGutenbergBlocks();
}

function bootstrapREST() {
    new RegisterREST();
}

// register WordPress hooks
add_action('init', 'ABTestingForWP\\bootstrap');
add_action('rest_api_init', 'ABTestingForWP\\bootstrapREST');