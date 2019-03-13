<?php

namespace ABTestingForWP;

class RegisterREST {

    private function registerRestRoutes($renderer) {
        register_rest_route(
            'ab-testing-for-wp/v1',
            '/ab-test',
            [
                'methods' => 'GET',
                'callback' => [$renderer, 'resolveVariant'],
            ]
        );
    }

    public function __construct() {
        $renderer = new BlockRenderer();

        $this->registerRestRoutes($renderer);
    }

}