<?php

namespace ABTestingForWP;

class ABTestManager {
    private $wpdb;
    private $variantTable;
    private $abTestTable;

    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;

        $table_prefix = $wpdb->prefix;

        $this->variantTable = $table_prefix . 'ab_testing_for_wp_variant';
        $this->abTestTable = $table_prefix . 'ab_testing_for_wp_ab_test';
    }

    public function updateBlockData($postId) {
        $content_post = get_post($postId);
        $content = $content_post->post_content;

        $testsData = ABTestContentParser::testDataFromContent($content);

        // wipe relational data, but not logs
        $this->wipeTestDataFromPost($postId);

        foreach ($testsData as $testData) {
            $this->insertTest($postId, $testData);

            foreach ($testData['variants'] as $variant) {
                $this->insertVariant($testData['id'], $variant);
            }
        }
    }

    public function getStatsByVariation($variantId) {
        $participants = $this->wpdb->get_var("
        SELECT COUNT(variantId)
        FROM `wp_ab_testing_for_wp_log` 
        WHERE variantId = '{$variantId}' AND track = 'P';
        ");

        $conversions = $this->wpdb->get_var("
        SELECT COUNT(variantId)
        FROM `wp_ab_testing_for_wp_log` 
        WHERE variantId = '{$variantId}' AND track = 'C';
        ");

        return [$participants, $conversions];
    }

    public function getTestsByGoal($postId) {
        
    }

    private function wipeTestDataFromPost($postId) {
        $query = "
        DELETE {$this->variantTable}, {$this->abTestTable}
        FROM {$this->variantTable}
        INNER JOIN {$this->abTestTable} ON {$this->variantTable}.testId = {$this->abTestTable}.id
        WHERE {$this->abTestTable}.postId = {$postId};
        ";

        $this->wpdb->query($query);
    }

    private function insertTest($postId, $testData) {
        $isEnabled = isset($testData['isEnabled']) && (bool) $testData['isEnabled'] ? 1 : 0;

        $query = "
        REPLACE INTO {$this->abTestTable} (id, postId, isEnabled, started, control, postGoal)
        VALUES ('{$testData['id']}', '{$postId}', {$isEnabled}, '', '{$testData['control']}', '{$testData['postGoal']}');
        ";

        $this->wpdb->query($query);
    }

    private function insertVariant($testId, $variant) {
        list($participants, $conversions) = $this->getStatsByVariation($variant['id']);

        $query = "
        REPLACE INTO {$this->variantTable} (id, testId, name, participants, conversions)
        VALUES ('{$variant['id']}', '{$testId}', '{$variant['name']}', {$participants}, {$conversions});
        ";

        $this->wpdb->query($query);
    }

}