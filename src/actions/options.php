<?php

namespace ABTestingForWP;

class OptionsActions {

    private $optionsManager;

    public function __construct() {
        $this->optionsManager = new OptionsManager();
    }

    public function handleOptions($request) {
        $body = json_decode($request->get_body(), true);

        if (!isset($body['key']) || !isset($body['value'])) {
            return new \WP_Error('rest_invalid_request', 'Missing key or value parameter.', ['status' => 400]);
        }

        $this->optionsManager->setOption($body['key'], $body['value']);

        return rest_ensure_response(true);
    }

}
