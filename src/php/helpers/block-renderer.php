<?php

namespace ABTestingForWP;

class BlockRenderer {

    private function randomTestDistributionPosition($variants) {
        $max = array_reduce(
            $variants,
            function ($acc, $variant) {
                return $acc + $variant['distribution'];
            },
            0
        );

        return rand(1, $max);
    }

    private function pickVariantAt($variants, $number) {
        $total = 0;

        foreach ($variants as $variant) {
            $total = $total + $variant['distribution'];

            if ($number <= $total) {
                return $variant;
            }
        }

        return $variants[0];
    }

    private function getVariantContent($content, $id) {
        $charset = get_bloginfo('charset');

        $doc = new \DOMDocument('1.0', $charset);
        $doc->loadHTML('<html>' . $content . '</html>');
        $xpath = new \DOMXPath($doc);

        $nodes = $xpath->query('//div[contains(@class, "' . $id . '")]');

        if (sizeof($nodes) === 0) {
            return '';
        }

        $content = $doc->saveHTML($nodes[0]);

        if ($charset === 'UTF-8') {
            return utf8_decode($content);
        }

        return $content;
    }

    private function pickVariant($variants, $testId, $variantId) {
        $abTestManager = new ABTestManager();
        $cookieData = [];
        $hasCookieData = CookieManager::isAvailable($testId);
        $pickedVariant = false;

        if ($hasCookieData) {
            $cookieData = CookieManager::getData($testId);
        }

        // try to find variant based on given id
        if (isset($variantId)) {
            foreach ($variants as $variant) {
                if ($variant['id'] === $variantId) {
                    $pickedVariant = $variant;

                    if ($hasCookieData && $cookieData['variant'] !== $pickedVariant['id']) {
                        // if not already tracked as converted
                        if ($cookieData['tracked'] !== 'C') {
                            // swap participation
                            $abTestManager->addTracking($cookieData['variant'], 'S');
                            $abTestManager->addTracking($pickedVariant['id'], 'P');
                        }

                        // save to cookie with new variant and old tracked state
                        CookieManager::setData($testId, $pickedVariant['id'], $cookieData['tracked']);
                    }
                }
            }
        }

        if (!$pickedVariant) {
            // see if variant is in cookies
            if (CookieManager::isAvailable($testId)) {
                // make sure variant is still in variants
                foreach ($variants as $variant) {
                    if ($variant['id'] === $cookieData['variant']) {
                        return $variant;
                    }
                }
            }

            // pick a random one instead
            $pickedVariant = $this->pickVariantAt($variants, $this->randomTestDistributionPosition($variants));
        }

        if (!$hasCookieData) {
            // add tracking and cookie
            $abTestManager->addTracking($pickedVariant['id'], 'P');
            CookieManager::setData($testId, $pickedVariant['id'], 'P');
        }

        return $pickedVariant;
    }

    private function getControlVariant($variants, $testId, $control) {
        // get control variant version
        foreach ($variants as $variant) {
            if ($variant['id'] === $control) {
                return $variant;
            }
        }

        // when all else fails... return the first variant
        return $variants[0];
    }

    private function wrapData($testId, $controlContent) {
        return
            '<div class="ABTestWrapper" data-test="' . $testId . '">'
                . $controlContent
            . '</div>';
    }

    public function resolveVariant($request) {
        if (!$request->get_param('test')) {
            return new \WP_Error('rest_invalid_request', 'Missing test parameter.', ['status' => 400]);
        }

        $testId = $request->get_param('test');
        $variantId = $request->get_param('variant');
        $forcedVariant = isset($variantId);

        if (DoNotTrack::isEnabled($request)) {
            return rest_ensure_response([ 'id' => $variantId ]);
        }

        $testManager = new ABTestManager();
        $postId = $testManager->getTestPostId($testId);

        // get contents of the post to extract gutenberg block
        $content_post = get_post($postId);
        $content = $content_post->post_content;

        // find the json data of the test in the post
        $testData = ABTestContentParser::findTestInContent($content, $testId);

        if (!$testData) {
            return new \WP_Error('rest_invalid_request', 'Could not find test data on post.', ['status' => 400]);
        }

        // extract data
        $isEnabled = isset($testData['isEnabled']) && $testData['isEnabled'];
        $variants = $testData['variants'];
        $control = $testData['control'];
        $skipVariation = $testData['control'];

        // find out if already in a variant
        if (CookieManager::isAvailable($testId)) {
            $cookieData = CookieManager::getData($testId);
            $skipVariation = $cookieData['variant'];
        }

        // get control variant of the test
        $controlVariant = $this->getControlVariant($variants, $testId, $control);

        // parse referer
        $refererQuery = parse_url($request->get_header('referer'))['query'];
        parse_str($refererQuery, $parsedQuery);

        // check if conditions are in query string
        foreach ($variants as $variant) {
            if (
                !$forcedVariant
                && isset($variant['conditions'])
                && count($variant['conditions']) > 0
            ) {
                foreach ($variant['conditions'] as $condition) {
                    if (
                        isset($parsedQuery[$condition['key']])
                        && $parsedQuery[$condition['key']] == $condition['value']
                    ) {
                        $variantId = $variant['id'];
                        break;
                    }
                }
            }
        }

        // skip picking variant if provided in request
        if (!$forcedVariant) {
            // pick a variant of the test
            $pickedVariant = $isEnabled
                ? $this->pickVariant($variants, $testId, $variantId)
                : $controlVariant;

            $variantId = $pickedVariant['id'];
        }

        // skip parsing HTML if variation already picked or control and variant not provided
        if ($variantId === $skipVariation && !$forcedVariant) {
            return rest_ensure_response([ 'id' => $variantId ]);
        }

        // parse HTML of the test and send
        $variantContent = apply_filters('the_content', $this->getVariantContent($content, $variantId));

        return rest_ensure_response([
            'id' => $variantId,
            'html' => $variantContent,
        ]);
    }

    public function renderTest($attributes, $content) {
        $variants = $attributes['variants'];
        $testId = $attributes['id'];
        $control = $attributes['control'];
        $isEnabled = isset($attributes['isEnabled']) ? $attributes['isEnabled'] : false;

        $controlVariant = $this->getControlVariant($variants, $testId, $control);

        if (!isset($controlVariant)) {
            return '';
        }

        $variantId = $controlVariant['id'];

        if (CookieManager::isAvailable($testId)) {
            $cookieData = CookieManager::getData($testId);
            $variantId = $cookieData['variant'];
        }

        return $this->wrapData($testId, $this->getVariantContent($content, $variantId));
    }

    public function renderInsertedTest($attributes) {
        $content_post = get_post($attributes['id']);
        $content = $content_post->post_content;

        return apply_filters('the_content', $content);
    }

}
