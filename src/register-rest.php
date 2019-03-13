<?php

namespace ABTestingForWP;

class RegisterREST {

    private function registerRestRoutes() {
        $renderer = new BlockRenderer();
        $tracker = new ABTestTracking();

        register_rest_route(
            'ab-testing-for-wp/v1',
            '/ab-test',
            [
                'methods' => 'GET',
                'callback' => [$renderer, 'resolveVariant'],
            ]
        );

        register_rest_route(
            'ab-testing-for-wp/v1',
            '/track',
            [
                'methods' => 'GET',
                'callback' => [$tracker, 'trackPage'],
            ]
        );
    }

    public function __construct() {
        $this->registerRestRoutes();
    }

}