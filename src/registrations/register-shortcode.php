<?php

namespace ABTestingForWP;

class RegisterShortcode {

    public function __construct() {
        add_action('init', [$this, 'registerTestShortcode']);
    }

    public function registerTestShortcode() {
        add_shortcode('ab-test', [$this, 'renderShortcode']);
    }

    public function renderShortcode($atts) {
        if (!isset($atts['id'])) return '';

        $post = get_post($atts['id']);

        if ($post->post_type !== 'abt4wp-test') return '';

        return apply_filters('the_content', $post->post_content);
    }

}
