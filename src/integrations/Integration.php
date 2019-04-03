<?php

namespace ABTestingForWP;

class Integration {

    protected function getPluginSlug() {
        return $this->pluginSlug;
    }

    public function __construct() {
        if (!is_plugin_active($this->getPluginSlug())) return;
        $this->loadIntegration();
    }

}