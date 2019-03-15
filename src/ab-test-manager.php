<?php

namespace ABTestingForWP;

class ABTestManager {
    private $wpdb;
    private $variantTable;
    private $abTestTable;
    private $logTable;

    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->wpdb->show_errors();

        $table_prefix = $wpdb->prefix;

        $this->variantTable = $table_prefix . 'ab_testing_for_wp_variant';
        $this->abTestTable = $table_prefix . 'ab_testing_for_wp_ab_test';
        $this->logTable = $table_prefix . 'ab_testing_for_wp_log';
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

    public function deleteBlockData($postId) {
        $this->wipeTestDataFromPost($postId);
    }

    public function getStatsByVariation($variantId) {
        $participants = $this->wpdb->get_var($this->wpdb->prepare("
        SELECT COUNT(variantId)
        FROM `{$this->logTable}` 
        WHERE variantId = %s AND track = 'P';
        ", $variantId));

        $conversions = $this->wpdb->get_var($this->wpdb->prepare("
        SELECT COUNT(variantId)
        FROM `{$this->logTable}` 
        WHERE variantId = %s AND track = 'C';
        ", $variantId));

        return [$participants, $conversions];
    }

    public function getEnabledVariantsByGoal($postId) {
        $variants = $this->wpdb->get_results($this->wpdb->prepare("
        SELECT t.id as testId, v.id as variantId, t.isEnabled
        FROM `{$this->abTestTable}` AS t
        INNER JOIN `{$this->variantTable}` AS v ON v.testid = t.id       
        WHERE t.postGoal = %d AND t.isEnabled = 1
        ", $postId));

        return array_map(
            function ($variant) {
                $variant = (array) $variant;
                $variant['isEnabled'] = (bool) $variant['isEnabled'];

                return $variant;
            },
            $variants
        );
    }

    public function addTracking($variantId, $type) {
        $this->wpdb->query($this->wpdb->prepare("
        INSERT INTO `{$this->logTable}` (variantId, track) VALUES (%s, %s);
        ", $variantId, $type));

        $this->updateVariationStats($variantId);
    }

    private function updateVariationStats($variantId) {
        list($participants, $conversions) = $this->getStatsByVariation($variantId);

        $query = $this->wpdb->prepare("
        UPDATE `{$this->variantTable}` SET participants = %d, conversions = %d
        WHERE id = %s;
        ", $participants, $conversions, $variantId);

        $this->wpdb->query($query);
    }

    private function wipeTestDataFromPost($postId) {
        $query = "
        DELETE `{$this->variantTable}`, `{$this->abTestTable}`
        FROM `{$this->variantTable}`
        INNER JOIN `{$this->abTestTable}` ON `{$this->variantTable}`.testId = `{$this->abTestTable}`.id
        WHERE `{$this->abTestTable}`.postId = %d;
        ";

        $this->wpdb->query($this->wpdb->prepare($query, $postId));
    }

    private function insertTest($postId, $testData) {
        $isEnabled = isset($testData['isEnabled']) && (bool) $testData['isEnabled'] ? 1 : 0;

        $query = "
        REPLACE INTO `{$this->abTestTable}` (id, postId, isEnabled, started, control, postGoal)
        VALUES (%s, %s, %d, %s, %s, %s);
        ";

        $this->wpdb->query($this->wpdb->prepare(
            $query, 
            $testData['id'], 
            $postId, 
            $isEnabled, 
            '', 
            $testData['control'], 
            $testData['postGoal']
        ));
    }

    private function insertVariant($testId, $variant) {
        list($participants, $conversions) = $this->getStatsByVariation($variant['id']);

        $query = "
        REPLACE INTO `{$this->variantTable}` (id, testId, name, participants, conversions)
        VALUES (%s, %s, %s, %d, %d);
        ";

        $this->wpdb->query($this->wpdb->prepare(
            $query,
            $variant['id'],
            $testId,
            $variant['name'],
            $participants, 
            $conversions
        ));
    }

}