<?php

namespace ABTestingForWP;

class RegisterRenderScripts {
    private $fileRoot;

    public function __construct($fileRoot) {
        $this->fileRoot = $fileRoot;

        add_action('the_post', [$this, 'addRenderScripts']);
    }

    public function addRenderScripts() {
        wp_register_script(
            'ab-testing-for-wp-frontend',
            plugins_url('/dist/ab-testing-for-wp.js', $this->fileRoot),
            ['wp-api-fetch']
        );
        wp_set_script_translations('ab-testing-for-wp-frontend', 'ab-testing-for-wp');

        $data = [
            'postId' => get_the_ID(),
            'restUrl' => get_rest_url(),
            'notAdmin' => DoNotTrack::notAdmin(),
        ];

        wp_localize_script('ab-testing-for-wp-frontend', 'ABTestingForWP', $data);

        wp_enqueue_script('ab-testing-for-wp-frontend');
    }

}
