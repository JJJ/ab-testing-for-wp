<?php

namespace ABTestingForWP;

class RegisterGutenbergBlocks {
    private $fileRoot;

    public function __construct($fileRoot) {
        $this->fileRoot = $fileRoot;

        add_action('init', [$this, 'bootstrap']);
    }

    public function bootstrap() {
        $renderer = new BlockRenderer();
        $postActions = new PostsActions();

        // register scripts
        $this->registerGutenbergScript('ab-testing-for-wp_ab-test-block', 'ab-test.js');
        $this->registerGutenbergScript('ab-testing-for-wp_ab-test-block-variant', 'ab-test-variant.js');
        $this->registerGutenbergScript('ab-testing-for-wp_ab-test-block-inserter', 'ab-test-inserter.js');

        // add Gutenberg options if admin
        $this->addOptions('ab-testing-for-wp_ab-test-block');

        // register AB test container
        register_block_type('ab-testing-for-wp/ab-test-block', [
            'editor_script' => 'ab-testing-for-wp_ab-test-block',
            'render_callback' => [$renderer, 'renderTest'],
        ]);

        // register AB test variant
        register_block_type('ab-testing-for-wp/ab-test-block-variant', [
            'editor_script' => 'ab-testing-for-wp_ab-test-block-variant',
        ]);

        // register AB test inserter
        register_block_type('ab-testing-for-wp/ab-test-block-inserter', [
            'editor_script' => 'ab-testing-for-wp_ab-test-block-inserter',
            'render_callback' => [$renderer, 'renderInsertedTest'],
        ]);

        // update test data meta on saving posts
        add_action('save_post', [$postActions, 'updateBlockData']);
        add_action('delete_post', [$postActions, 'deleteBlockData']);
    }

    private function addOptions($scriptHandle) {
        // only for admin pages
        if(is_admin() && (!defined('DOING_AJAX') || !DOING_AJAX)) {
            $optionsManager = new OptionsManager();

            wp_localize_script($scriptHandle, 'ABTestingForWP_Options', $optionsManager->getAllOptions());
        }
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
                'wp-date',
            ]
        );
        wp_set_script_translations($name, 'ab-testing-for-wp');
    }

}
