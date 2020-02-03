<?php

namespace ABTestingForWP;

class TestsActions {

    private $testManager;

    public function __construct() {
        $this->testManager = new ABTestManager();
    }

    public function getTestsData($request) {
        if (!$request->get_param('id')) {
            return new \WP_Error('rest_invalid_request', 'Missing test id parameter.', ['status' => 400]);
        }

        $ids = $request->get_param('id');

        return rest_ensure_response($this->testManager->getTestsByIds($ids));
    }

    public function updateTestData($request) {
        $body = json_decode($request->get_body(), true);

        if (!isset($body['id'])) {
            return new \WP_Error('rest_invalid_request', 'Missing test id in body.', ['status' => 400]);
        }

        return rest_ensure_response($this->testManager->updateTest($body));
    }

    public function getTestPreviewContentByPost($request) {
        if (!$request->get_param('id')) {
            return new \WP_Error('rest_invalid_request', 'Missing test id parameter.', ['status' => 400]);
        }

        $id = $request->get_param('id');

        $content_post = get_post($id);
        $content = $content_post->post_content;

        return rest_ensure_response([
            'html' => $this->getPreviewHTML(apply_filters('the_content', $content)),
            'editLink' => get_edit_post_link($id)
        ]);
    }

    private function getPreviewHTML($body) {
        ob_start();

        echo '<!DOCTYPE html>
        <html lang="en-US" class="no-js">
        <head>';
        do_action( 'wp_head' );
        echo "</head>
        <body style='overflow: hidden'>
            <div class='entry'>
                <div class='entry-content' style='margin: 0'>
                    <div id='ab-testing-for-wp-wrapper' style='margin: 0'>
        ";

        echo $body;

        echo "      <div>
                </div>
            </div>
        </body>
        <script>window.parent.postMessage(JSON.stringify({ from: '%ab-testing-id%', height: document.body.scrollHeight }), '*');</script>
        </html>";

        $output = ob_get_contents();
        ob_end_clean();

        return $output;
    }

}
