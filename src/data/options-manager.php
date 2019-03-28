<?php

namespace ABTestingForWP;

class OptionsManager {
    
    private $optionsKey = 'ab-testing-for-wp-options';

    public function getOption($key, $default) {
        $allOptions = $this->getAllOptions();

        if (!isset($allOptions[$key])) {
            return isset($default) ? $default : null;
        }

        return $allOptions[$key];
    }

    public function setOption($key, $value) {
        $allOptions = $this->getAllOptions();
        $allOptions[$key] = $value;

        $this->saveOptions($allOptions);
    }

    public function getAllOptions() {
        return get_option($this->optionsKey, new \stdClass());
    }

    private function saveOptions($options) {
        update_option($this->optionsKey, $options, true);
    }

}