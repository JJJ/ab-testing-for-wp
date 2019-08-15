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

    protected function getPluginSlug() {
        return $this->pluginSlug;
    }

    private function isPluginActive() {
        return is_plugin_active($this->getPluginSlug()) && $this->extraPluginCheck();
    }

    protected function addCustomQuery($type = '', $query = '', $tranform = false) {
        if ($query === '') return;

        // very ugly pass arguments to next function call
        $this->query = $query;
        $this->tranform = $tranform;

        add_filter("ab-testing-for-wp_custom-query-$type", [$this, 'performCustomQuery']);
    }

    public function performCustomQuery() {
        $query = str_replace('%s', $this->wpdb->prefix, $this->query);

        $results = $this->wpdb->get_results($query);

        if (!$this->tranform) return $results;
        return array_map($this->tranform, $results);
    }

    /**
     * You can overwrite this method for an extra check in the isPluginActive
     */
    protected function extraPluginCheck() {
        return true;
    }

}
