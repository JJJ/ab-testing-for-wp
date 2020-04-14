<?php

namespace ABTestingForWP;

class PostsActions {

    private $abTestManager;

    public function __construct() {
        $this->abTestManager = new ABTestManager();
    }

    public function updateBlockData($postId) {
        $post = get_post($postId);

        // skip saving revisions
        if ($post->post_type === 'revision' || $post->post_status === 'auto-draft') return;

        $testsData = $this->abTestManager->getTestDataByPost($postId);

        // wipe relational data, but not logs
        $this->abTestManager->wipeTestDataFromPost($postId);

        foreach ($testsData as $testData) {
            // fix title if single test post type
            if ($post->post_type === 'abt4wp-test') {
                $testData['title'] = $post->post_title;
            }

            $this->abTestManager->insertTest($postId, $testData);

            foreach ($testData['variants'] as $variant) {
                $this->abTestManager->insertVariant($testData['id'], $variant);

                if (isset($variant['conditions'])) {
                    foreach ($variant['conditions'] as $condition) {
                        $this->abTestManager->insertVariantCondition($variant, $condition);
                    }
                }
            }
        }
    }

    public function deleteBlockData($postId) {
        $this->abTestManager->archiveTestDataFromPost($postId);
    }

    public function getPostType($request) {
        $id = $request->get_param('post_id');

        if (!$id && $id !== '0') {
            return new \WP_Error('rest_invalid_request', 'Missing post_id parameter.', ['status' => 400]);
        }

        return rest_ensure_response(get_post_type($id));
    }

    public function getPostsByType($request) {
        if (!$request->get_param('type')) {
            return new \WP_Error('rest_invalid_request', 'Missing type parameter.', ['status' => 400]);
        }

        $type = $request->get_param('type');
        $notIn = [];

        if ($request->get_param('exclude')) {
            $notIn = explode(',', $request->get_param('exclude'));
        }

        // catch custom table structure CPTs
        $customQueryResults = apply_filters("ab-testing-for-wp_custom-query-$type", false);

        if ($customQueryResults) return rest_ensure_response($customQueryResults);

        // or if it's a "normal" CPT: perform ordinary query
        $query = new \WP_Query([
            'post_type' => $type,
            'post__not_in' => $notIn,
            'post_status' => ['publish'],
            'numberposts' => -1,
        ]);

        if ($query->have_posts()) {
            return rest_ensure_response($query->posts);
        }

        return rest_ensure_response([]);
    }

}
