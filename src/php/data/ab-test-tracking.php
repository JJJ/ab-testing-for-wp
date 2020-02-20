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

        if (DoNotTrack::isEnabled($request)) {
            return rest_ensure_response([]);
        }

        $postId = $request->get_param('post');

        $tracked = $this->trackGoal($postId, get_post_type($postId));

        return rest_ensure_response($tracked);
    }

    public function trackLink($request) {
        $body = $request->get_body();
        $data = json_decode($body, true);

        if ($data === NULL || !isset($data['url'])) {
            return new \WP_Error('rest_invalid_request', 'Invalid beacon.', ['status' => 400]);
        }

        if (DoNotTrack::isEnabled($request)) {
            return rest_ensure_response([]);
        }

        $url = $data['url'];

        $tracked = $this->trackGoal($url, 'outbound');

        return rest_ensure_response($tracked);
    }

    public function trackGoal($goal, $goalType = '') {
        $variants = $this->abTestManager->getEnabledVariantsByGoal($goal, $goalType);

        return $this->trackVariantsInCookie($variants);
    }

    private function trackVariantsInCookie($variants) {
        $tracked = $this->addVariantsToCookie($variants);

        return $tracked;
    }

    private function addVariantsToCookie($variants) {
        $tracked = [];

        foreach ($variants as $variant) {
            if (
                // test not enabled
                !$variant['isEnabled']
                // or no cookie data for test
                || !CookieManager::isAvailable($variant['testId'])
            ) {
                continue;
            }

            $cookieData = CookieManager::getData($variant['testId']);

            if (
                // not already tracked and participant
                $cookieData['tracked'] === 'P'
                // actually in this variant
                && $cookieData['variant'] === $variant['variantId']
            ) {
                array_push($tracked, $variant['variantId']);

                // save in DB
                $this->abTestManager->addTracking($variant['variantId'], 'C');

                // save in cookie
                CookieManager::setData($variant['testId'], $variant['variantId'], 'C');
            }
        }

        return $tracked;
    }

}
