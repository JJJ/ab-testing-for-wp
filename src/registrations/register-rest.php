<?php

namespace ABTestingForWP;

class RegisterREST {

    private function registerRestRoutes() {
        $renderer = new BlockRenderer();
        $tracker = new ABTestTracking();
        $stats = new ABTestStats();

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

        register_rest_route(
            'ab-testing-for-wp/v1',
            '/stats',
            [
                'methods' => 'GET',
                'callback' => [$stats, 'getTestStats'],
            ]
        );
    }

    public function __construct() {
        $this->registerRestRoutes();
    }

}