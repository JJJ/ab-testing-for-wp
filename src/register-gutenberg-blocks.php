<?php

namespace ABTestingForWP;

class RegisterGutenbergBlocks {
    private $fileRoot;

    public function __construct($fileRoot) {
        $this->fileRoot = $fileRoot;

        $renderer = new BlockRenderer();

        // register scripts
        $this->registerGutenbergScript('ab-testing-for-wp_ab-test-block', 'ab-test.js');
        $this->registerGutenbergScript('ab-testing-for-wp_ab-test-block-variant', 'ab-test-variant.js');

        // register AB test container
        register_block_type('ab-testing-for-wp/ab-test-block', [
            'editor_script' => 'ab-testing-for-wp_ab-test-block',
            'render_callback' => [$renderer, 'renderTest'],
        ]);

        // register AB test variant
        register_block_type('ab-testing-for-wp/ab-test-block-variant', [
            'editor_script' => 'ab-testing-for-wp_ab-test-block-variant',
        ]);

        // register meta field
        register_meta('post', 'ab-testing-for-wp_test-data', [
            'show_in_rest' => true,
            'single' => true,
        ]);

        // update test data meta on saving posts
        add_action('save_post', [$this, 'updateTestDataMeta']);
    }

    public function updateTestDataMeta($postId) {
        $content_post = get_post($postId);
        $content = $content_post->post_content;

        $testData = ABTestContentParser::testDataFromContent($content);

        update_post_meta($postId, 'ab-testing-for-wp_test-data', json_encode($testData));
    }

    public function registerGutenbergScript($name, $file) {
        wp_register_script(
            $name,
            plugins_url('/dist/' . $file, $this->fileRoot),
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-i18n', 'wp-components', 'wp-api-fetch']
        );
    }

}
