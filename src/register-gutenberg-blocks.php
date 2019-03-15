<?php

namespace ABTestingForWP;

class RegisterGutenbergBlocks {
    private $fileRoot;

    public function __construct($fileRoot) {
        $this->fileRoot = $fileRoot;

        $renderer = new BlockRenderer();
        $abTestManager = new ABTestManager();

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

        // update test data meta on saving posts
        add_action('save_post', [$abTestManager, 'updateBlockData']);
        add_action('delete_post', [$abTestManager, 'deleteBlockData']);
    }

    public function registerGutenbergScript($name, $file) {
        wp_register_script(
            $name,
            plugins_url('/dist/' . $file, $this->fileRoot),
            [
                'wp-blocks',
                'wp-element',
                'wp-editor',
                'wp-i18n',
                'wp-components',
                'wp-api-fetch',
                'wp-data',
            ]
        );
    }

}
