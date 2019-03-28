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
        if ($post->post_type === 'revision') return;

        $testsData = $this->abTestManager->getTestDataByPost($postId);

        // wipe relational data, but not logs
        $this->abTestManager->wipeTestDataFromPost($postId);

        foreach ($testsData as $testData) {
            $this->abTestManager->insertTest($postId, $testData);

            foreach ($testData['variants'] as $variant) {
                $this->abTestManager->insertVariant($testData['id'], $variant);
            }
        }
    }

    public function deleteBlockData($postId) {
        $this->abTestManager->archiveTestDataFromPost($postId);
    }

}