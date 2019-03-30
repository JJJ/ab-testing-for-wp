<?php

namespace ABTestingForWP;

class OptionsActions {

    private $optionsManager;

    public function __construct() {
        $this->optionsManager = new OptionsManager();
    }

    public function handleOptions() {
        if (!$request->get_param('key') || !$request->get_param('value')) {
            return new \WP_Error('rest_invalid_request', 'Missing key or value parameter.', ['status' => 400]);
        }

        $key = $request->get_param('key');
        $value = $request->get_param('value');

        $this->optionsManager->setOption($key, $value);
    }

}