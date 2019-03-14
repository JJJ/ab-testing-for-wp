<?php

namespace ABTestingForWP;

class ABTestTracking {

    public function trackPage($request) {
        if (!$request->get_param('post')) {
            return new \WP_Error('rest_invalid_request', 'Missing post parameter.', ['status' => 400]);
        }

        $postId = $request->get_param('post');

        // get tests with this page as goal

        return rest_ensure_response(true);
    }

}