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

        $tracked = $this->trackPostId($postId, get_post_type($postId));

        return rest_ensure_response($tracked);
    }

    public function trackLink($request) {
        $body = $request->get_body();
        $data = json_decode($body, true);

        if ($data === NULL || !isset($data['url'])) {
            return new \WP_Error('rest_invalid_request', 'Invalid beacon.', ['status' => 400]);
        }

        $url = $data['url'];

        $tracked = $this->trackUrl($url);

        return rest_ensure_response($tracked);
    }

    public function trackUrl($url) {
        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $variants = $this->abTestManager->getEnabledVariantsByGoal($url, "outbound");
            return $this->trackVariantsInCookie($variants);
        }

        // if no cookie... can't track page
        return [];
    }

    public function trackPostId($postId, $postGoalType = '') {
        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $variants = $this->abTestManager->getEnabledVariantsByGoal($postId, $postGoalType);
            return $this->trackVariantsInCookie($variants);
        }

        // if no cookie... can't track page
        return [];
    }

    private function trackVariantsInCookie($variants) {
        $mergeResult = $this->addVariantsToCookie($variants, $_COOKIE['ab-testing-for-wp']);

        setcookie('ab-testing-for-wp', json_encode($mergeResult['cookieData']), time() + (60*60*24*30), '/');

        return $mergeResult['tracked'];
    }

    private function addVariantsToCookie($variants, $cookie) {
        $cookieData = json_decode(stripslashes($_COOKIE['ab-testing-for-wp']), true);

        // create tracked array if not present
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

        return [
            'tracked' => $tracked,
            'cookieData' => $cookieData,
        ];
    }

    public function addParticipation($variantId) {
        $this->abTestManager->addTracking($variantId, 'P');
    }

}
