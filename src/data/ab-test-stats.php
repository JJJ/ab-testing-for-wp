<?php

namespace ABTestingForWP;

class ABTestStats {
    private $abTestManager;

    public function __construct() {
        $this->abTestManager = new ABTestManager();
    }

    public function getTestStats($request) {
        if (!$request->get_param('test')) {
            return new \WP_Error('rest_invalid_request', 'Missing test parameter.', ['status' => 400]);
        }

        $testId = $request->get_param('test');

        return rest_ensure_response($this->abTestManager->getStatsByTest($testId));
    }

}