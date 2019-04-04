<?php

namespace ABTestingForWP;

if(!function_exists('is_plugin_active')) {
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
}

class Integration {

    protected function getPluginSlug() {
        return $this->pluginSlug;
    }

    public function __construct() {
        if (!$this->isPluginActive()) return;
        $this->loadIntegration();
    }

    private function isPluginActive() {
        return is_plugin_active($this->getPluginSlug()) && $this->extraPluginCheck();
    }

    /**
     * You can overwrite this method for an extra check in the isPluginActive
     */
    protected function extraPluginCheck() {
        return true;
    }

}