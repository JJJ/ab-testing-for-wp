<?php

namespace ABTestingForWP;

class RegisterREST {

    private function registerRestRoutes() {
        $renderer = new BlockRenderer();
        $tracker = new ABTestTracking();
        $stats = new ABTestStats();
        $options = new OptionsActions();
        $posts = new PostsActions();

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
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                }
            ]
        );

        register_rest_route(
            'ab-testing-for-wp/v1',
            '/options',
            [
                'methods' => 'POST',
                'callback' => [$options, 'handleOptions'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                }
            ]
        );

        register_rest_route(
            'ab-testing-for-wp/v1',
            '/get-post-type',
            [
                'methods' => 'GET',
                'callback' => [$posts, 'getPostType'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                }
            ]
        );

        register_rest_route(
            'ab-testing-for-wp/v1',
            '/get-posts-by-type',
            [
                'methods' => 'GET',
                'callback' => [$posts, 'getPostsByType'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                }
            ]
        );
    }

    public function __construct() {
        $this->registerRestRoutes();
    }

}