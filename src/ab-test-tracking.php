<?php

namespace ABTestingForWP;

class ABTestTracking {

    public function trackPage($request) {
        if (!$request->get_param('post')) {
            return new \WP_Error('rest_invalid_request', 'Missing post parameter.', ['status' => 400]);
        }

        $postId = $request->get_param('post');

        // get tests with this page as goal
        $cookieData = [];

        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $cookieData = json_decode(stripslashes($_COOKIE['ab-testing-for-wp']), true);
        }

        $abTestManager = new ABTestManager();
        $variants = $abTestManager->getVariantsByGoal($postId);

        $tracked = [];

        foreach ($variants as $variant) {
            if (!$variant['isEnabled']) continue;

            if (
                isset($cookieData[$variant['testId']]) 
                && $cookieData[$variant['testId']] === $variant['variantId']
            ) {
                array_push($tracked, $variant['variantId']);
                $abTestManager->addTracking($variant['variantId'], 'C');
            }
        }

        return rest_ensure_response($tracked);
    }



}