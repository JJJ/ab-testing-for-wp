<?php

namespace ABTestingForWP;

class ABTestTracking {

    public function trackPage($request) {
        if (!$request->get_param('post')) {
            return new \WP_Error('rest_invalid_request', 'Missing post parameter.', ['status' => 400]);
        }

        $postId = $request->get_param('post');

        // get contents of the post to extract gutenberg block
        $content_post = get_post($postId);
        $content = $content_post->post_content;

        // find the json data of all tests in the post
        $testsData = ABTestContentParser::testDataFromContent($content);

        $completed = [];

        foreach ($testsData as $testData) {
            $isEnabled = isset($testData['isEnabled']) && (bool) $testData['isEnabled'];

            if (!$isEnabled) continue; 

            if (isset($_COOKIE['ab-testing-for-wp'])) {
                $cookieData = json_decode(stripslashes($_COOKIE['ab-testing-for-wp']), true);

                if (isset($cookieData[$testData['id']])) {
                    // variant is know to cookie
                    $variantId = $cookieData[$testData['id']];

                    // if not tracked in cookie
                    if (
                        !isset($cookieData['tracked'])
                        || !array_search($variantId, $cookieData['tracked'])
                    ) {
                        // add score to db
                        echo "SCORE";
                    }

                    array_push($completed, $variantId);
                }
            }
        }

        return rest_ensure_response($completed);
    }

}