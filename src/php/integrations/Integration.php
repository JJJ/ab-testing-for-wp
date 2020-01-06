<?php

namespace ABTestingForWP;

if(!function_exists('is_plugin_active')) {
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
}

class Integration {

    protected $wpdb;
    private $query = '';
    private $transform = false;

    public function __construct() {
        if (!$this->isPluginActive()) return;
        $this->loadIntegration();

        global $wpdb;
        $this->wpdb = $wpdb;
    }

    protected function loadIntegration() {
    }

    protected function getPluginSlug() {
        return $this->pluginSlug;
    }

    private function isPluginActive() {
        return is_plugin_active($this->getPluginSlug()) && $this->extraPluginCheck();
    }

    protected function addCustomQuery($type = '', $query = '', $transform = false) {
        if ($query === '') return;

        add_filter(
            "ab-testing-for-wp_custom-query-{$type}",
            function () use ($query, $transform) {
                $this->performCustomQuery($query, $transform);
            },
            10,
            0
        );
    }

    public function performCustomQuery($query, $transform) {
        $results = $this->wpdb->get_results(str_replace('%s', $this->wpdb->prefix, $query));

        if (!$transform) return $results;

        return array_map($transform, $results);
    }

    /**
     * You can overwrite this method for an extra check in the isPluginActive
     */
    protected function extraPluginCheck() {
        return true;
    }

}
