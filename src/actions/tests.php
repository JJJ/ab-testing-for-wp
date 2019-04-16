<?php

namespace ABTestingForWP;

class TestsActions {

    private $testManager;

    public function __construct() {
        $this->testManager = new ABTestManager();
    }

    public function getTestsData($request) {
        if (!$request->get_param('id')) {
            return new \WP_Error('rest_invalid_request', 'Missing test id parameter.', ['status' => 400]);
        }

        $ids = $request->get_param('id');

        return rest_ensure_response($this->testManager->getTestsByIds($ids));
    }

}