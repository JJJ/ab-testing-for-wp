<?php

namespace ABTestingForWP;

class ABTestManager {
    private $wpdb;
    private $variantTable;
    private $abTestTable;
    private $logTable;
    private $postsTable;

    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->wpdb->show_errors();

        $table_prefix = $wpdb->prefix;

        $this->variantTable = $table_prefix . 'ab_testing_for_wp_variant';
        $this->abTestTable = $table_prefix . 'ab_testing_for_wp_ab_test';
        $this->logTable = $table_prefix . 'ab_testing_for_wp_log';
        $this->postsTable = $table_prefix . 'posts';
    }

    public function getTestDataByPost($postId) {
        $content_post = get_post($postId);
        $content = $content_post->post_content;

        return ABTestContentParser::testDataFromContent($content);
    }

    public function getStatsByTest($testId) {
        return $this->wpdb->get_results($this->wpdb->prepare("
        SELECT id, name, participants, conversions
        FROM `{$this->variantTable}` 
        WHERE testId = %s;
        ", $testId));
    }

    public function hasTests() {
        return sizeof($this->wpdb->get_results("SELECT id FROM `{$this->abTestTable}`")) > 0;
    }

    public function getAllTests() {
        $data = $this->wpdb->get_results("
        SELECT t.id, t.isEnabled, t.startedAt, t.control, t.postId, t.postGoal,
        p1.post_title AS postName, p2.post_title AS goalName, p2.post_type AS goalType,
        t.isArchived,
        (
            SELECT SUM(participants)
            FROM wp_ab_testing_for_wp_variant AS v
            WHERE v.testId = t.id
        ) as totalParticipants
        FROM `{$this->abTestTable}` AS t
        INNER JOIN `{$this->postsTable}` AS p1 ON t.postId = p1.ID
        LEFT JOIN `{$this->postsTable}` AS p2 ON t.postGoal = p2.ID
        WHERE t.isArchived = 0
        ORDER BY t.postId ASC
        ");

        return array_map(
            function ($test) {
                $test = (array) $test;
                $test['isEnabled'] = (bool) $test['isEnabled'];
                $test['isArchived'] = (bool) $test['isArchived'];

                $test['postLink'] = get_edit_post_link($test['postId']);
                $test['goalLink'] = get_edit_post_link($test['postGoal']);

                $test['variants'] = $this->wpdb->get_results($this->wpdb->prepare("
                SELECT id, name, participants, conversions
                FROM `{$this->variantTable}`
                WHERE testId = %s
                ORDER BY name ASC
                ", $test['id']));

                foreach($test['variants'] as $variant) {
                    $variant = (array) $variant;

                    if ($variant['id'] === $test['control']) {
                        $controlVariant = $variant;
                    }
                }

                $crc = $controlVariant['participants'] > 0
                    ? $controlVariant['conversions'] / $controlVariant['participants']
                    : 0;

                $test['variants'] = array_map(
                    function ($variant) use ($crc) {
                        $variant = (array) $variant;

                        $variant['conversions'] = (int) $variant['conversions'];
                        $variant['participants'] = (int) $variant['participants'];

                        $crr = $variant['participants'] > 0
                            ? $variant['conversions'] / $variant['participants']
                            : 0;

                        $variant['rate'] = $variant['participants'] > 0
                            ? round($crr * 100)
                            : 0;
                        $variant['uplift'] = round($crc === 0 ? 0 : ($crr - $crc) / $crc * 1000) / 10;

                        return $variant;
                    },
                    $test['variants']
                );

                $test['variants'] = array_map(
                    function ($variant) use ($test) {
                        $variant['leading'] = true;

                        foreach ($test['variants'] as $check) {
                            if ($check['rate'] > $variant['rate']) {
                                $variant['leading'] = false;
                            }
                        }

                        return $variant;
                    },
                    $test['variants']
                );

                return $test;
            },
            $data
        );
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

    public function wipeTestDataFromPost($postId) {
        $query = "
        DELETE `{$this->variantTable}`, `{$this->abTestTable}`
        FROM `{$this->variantTable}`
        INNER JOIN `{$this->abTestTable}` ON `{$this->variantTable}`.testId = `{$this->abTestTable}`.id
        WHERE `{$this->abTestTable}`.postId = %d;
        ";

        $this->wpdb->query($this->wpdb->prepare($query, $postId));
    }

    public function archiveTestDataFromPost($postId) {
        $query = "UPDATE `{$this->abTestTable}` SET isArchived = 1 WHERE postId = %d";
        $this->wpdb->query($this->wpdb->prepare($query, $postId));
    }

    public function insertTest($postId, $testData) {
        $isEnabled = isset($testData['isEnabled']) && (bool) $testData['isEnabled'] ? 1 : 0;
        $startedAt = isset($testData['startedAt']) ? $testData['startedAt'] : '';
        $postGoal = isset($testData['postGoal']) ? $testData['postGoal'] : 0;

        $query = "
        REPLACE INTO `{$this->abTestTable}` (id, postId, isEnabled, startedAt, control, postGoal, postGoalType, isArchived)
        VALUES (%s, %s, %d, %s, %s, %s, %s, %d);
        ";

        $this->wpdb->query($this->wpdb->prepare(
            $query,
            $testData['id'],
            $postId,
            $isEnabled,
            $startedAt,
            $testData['control'],
            $postGoal,
            $testData['postGoalType'],
            0
        ));
    }

    public function insertVariant($testId, $variant) {
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