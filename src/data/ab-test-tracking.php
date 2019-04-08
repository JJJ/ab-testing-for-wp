<?php

namespace ABTestingForWP;

class ABTestTracking {
    private $abTestManager;

    public function __construct() {
        $this->abTestManager = new ABTestManager();
    }

    public function trackPage($request) {
        if (!$request->get_param('post')) {
            return new \WP_Error('rest_invalid_request', 'Missing post parameter.', ['status' => 400]);
        }

        $postId = $request->get_param('post');

        $tracked = $this->trackPostId($postId);

        return rest_ensure_response($tracked);
    }

    public function trackPostId($postId, $postGoalType = '') {
        // get tests with this page as goal
        $cookieData = [];

        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $cookieData = json_decode(stripslashes($_COOKIE['ab-testing-for-wp']), true);
        }

        $variants = $this->abTestManager->getEnabledVariantsByGoal($postId, $postGoalType);

        if (!isset($cookieData['tracked'])) {
            $cookieData['tracked'] = [];
        }

        $tracked = [];

        foreach ($variants as $variant) {
            if (!$variant['isEnabled']) continue;

            if (
                // not already tracked
                !in_array($variant['variantId'], $cookieData['tracked'])
                // if in this tests participants
                && isset($cookieData[$variant['testId']])
                // actually in this variant
                && $cookieData[$variant['testId']] === $variant['variantId']
            ) {
                array_push($tracked, $variant['variantId']);
                $this->abTestManager->addTracking($variant['variantId'], 'C');
            }
        }

        // add tracked variants to cookie
        $cookieData['tracked'] = array_merge([], $cookieData['tracked'], $tracked);

        setcookie('ab-testing-for-wp', json_encode($cookieData), time() + (60*60*24*30), '/');

        return $tracked;
    }

    public function addParticipation($variantId) {
        $this->abTestManager->addTracking($variantId, 'P');
    }

}