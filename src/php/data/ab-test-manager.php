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

        $this->variantConditionTable = $table_prefix . 'ab_testing_for_wp_variant_condition';
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
        $this->wpdb->hide_errors();

        $results =  $this->wpdb->get_results($this->wpdb->prepare("
        SELECT id, name, participants, conversions
        FROM `{$this->variantTable}`
        WHERE testId = %s;
        ", $testId));

        $this->wpdb->show_errors();

        return $results;
    }

    public function hasTests() {
        $this->wpdb->hide_errors();

        $result = sizeof($this->wpdb->get_results("SELECT id FROM `{$this->abTestTable}`")) > 0;

        $this->wpdb->show_errors();

        return $result;
    }

    public function getAllTests($extraQuery = '') {
        $this->wpdb->hide_errors();

        $data = $this->wpdb->get_results("
        SELECT t.id, t.isEnabled, t.startedAt, t.title, t.control, t.postId, t.postGoal,
        t.postGoalType, p1.post_type AS postType, p1.post_title AS postName,
        p2.post_title AS goalName, p2.post_type AS goalType, t.isArchived,
        (
            SELECT SUM(participants)
            FROM `{$this->variantTable}` AS v
            WHERE v.testId = t.id
        ) as totalParticipants
        FROM `{$this->abTestTable}` AS t
        INNER JOIN `{$this->postsTable}` AS p1 ON t.postId = p1.ID
        LEFT JOIN `{$this->postsTable}` AS p2 ON t.postGoal = p2.ID
        WHERE t.isArchived = 0 {$extraQuery}
        ORDER BY t.postId ASC
        ");

        $this->wpdb->show_errors();

        return array_map([$this, 'mapTest'], $data);
    }

    public function getTestById($testId) {
        $results = $this->getAllTests($this->wpdb->prepare('AND t.id = %s', $testId));
        return $results[0];
    }

    public function getTestsByIds($ids) {
        $ids = array_map(
            function ($id) {
                return $this->wpdb->prepare("%s", $id);
            },
            $ids
        );

        $extraQuery = "AND t.id IN (" . join(",", $ids) . ")";

        return $this->getAllTests($extraQuery);
    }

    public function getTestPostId($testId) {
        $this->wpdb->hide_errors();

        $result = $this->wpdb->get_var($this->wpdb->prepare("
        SELECT t.postId
        FROM `{$this->abTestTable}` AS t
        WHERE t.isArchived = 0 AND t.id = %s
        ORDER BY t.postId ASC
        ", $testId));

        $this->wpdb->show_errors();

        return $result;
    }

    private function mapTest($test) {
        $test = (array) $test;
        $test['isEnabled'] = (bool) $test['isEnabled'];
        $test['isArchived'] = (bool) $test['isArchived'];

        $test['postLink'] = get_edit_post_link($test['postId']);
        $test['postDeleteLink'] = get_delete_post_link($test['postId'], '', true);
        $test['goalLink'] = get_edit_post_link($test['postGoal']);

        $this->wpdb->hide_errors();

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

        $test['variants'] = array_map(
            function ($variant) {
                $variant = (array) $variant;

                $variant['conditions'] = [];

                $prepared = $this->wpdb->prepare("
                SELECT `key`, `value`
                FROM `{$this->variantConditionTable}`
                WHERE variantId = %s
                ORDER BY `key` ASC
                ", $variant['id']);

                $conditions = $this->wpdb->get_results($prepared);

                foreach ($conditions as $condition) {
                    array_push(
                        $variant['conditions'],
                        [
                            'key' => $condition->key,
                            'value' => $condition->value,
                        ]
                    );
                }

                return $variant;
            },
            $test['variants']
        );

        $this->wpdb->show_errors();

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
    }

    public function mapToOutput($test) {
        $test['startedAt'] = strtotime($test['startedAt']) * 1000;

        // if no goal is set, show placeholders
        if ($test['postGoal'] === '0' || $test['postGoal'] === '') {
            $test['goalName'] = '—';
        }

        // fill in conversion goal for outbound links
        if ($test['postGoalType'] === 'outbound') {
            $test['goalName'] = $test['postGoal'];
            $test['goalLink'] = $test['postGoal'];
        }

        return $test;
    }

    public function getStatsByVariation($variantId) {
        $this->wpdb->hide_errors();

        $participants = $this->wpdb->get_var($this->wpdb->prepare("
        SELECT COUNT(variantId)
        FROM `{$this->logTable}`
        WHERE variantId = %s AND track = 'P';
        ", $variantId));

        $switchers = $this->wpdb->get_var($this->wpdb->prepare("
        SELECT COUNT(variantId)
        FROM `{$this->logTable}`
        WHERE variantId = %s AND track = 'S';
        ", $variantId));

        $conversions = $this->wpdb->get_var($this->wpdb->prepare("
        SELECT COUNT(variantId)
        FROM `{$this->logTable}`
        WHERE variantId = %s AND track = 'C';
        ", $variantId));

        $this->wpdb->show_errors();

        return [$participants - $switchers, $conversions];
    }

    public function getEnabledVariantsByGoal($goal, $goalType = '') {
        $extraQuery = "";

        if ($goalType !== '') {
            $extraQuery = $this->wpdb->prepare("AND t.postGoalType = %s", $goalType);
        }

        $query = $this->wpdb->prepare("
        SELECT t.id as testId, v.id as variantId, t.isEnabled
        FROM `{$this->abTestTable}` AS t
        INNER JOIN `{$this->variantTable}` AS v ON v.testid = t.id
        WHERE t.postGoal = %s AND t.isEnabled = 1 {$extraQuery}
        ", $goal);

        $this->wpdb->hide_errors();

        $variants = $this->wpdb->get_results($query);

        $this->wpdb->show_errors();

        return array_map(
            function ($variant) {
                $variant = (array) $variant;
                $variant['isEnabled'] = (bool) $variant['isEnabled'];

                return $variant;
            },
            $variants
        );
    }

    public function addTracking($variantId, $type, $date = false) {
        $this->wpdb->hide_errors();

        if ($date) {
            $query = $this->wpdb->prepare(
                "INSERT INTO `{$this->logTable}` (variantId, track, date) VALUES (%s, %s, %s);",
                $variantId,
                $type,
                $date
            );
        } else {
            $query = $this->wpdb->prepare(
                "INSERT INTO `{$this->logTable}` (variantId, track) VALUES (%s, %s);",
                $variantId,
                $type
            );
        }

        $this->wpdb->query($query);

        $this->wpdb->show_errors();

        $this->updateVariationStats($variantId);
    }

    public function getAllTracking() {
        $this->wpdb->hide_errors();

        $results = $this->wpdb->get_results("SELECT variantId, track, `date` FROM `{$this->logTable}`;");

        $this->wpdb->show_errors();

        return $results;
    }

    private function updateVariationStats($variantId) {
        list($participants, $conversions) = $this->getStatsByVariation($variantId);

        $query = $this->wpdb->prepare("
        UPDATE `{$this->variantTable}` SET participants = %d, conversions = %d
        WHERE id = %s;
        ", $participants, $conversions, $variantId);

        $this->wpdb->hide_errors();

        $this->wpdb->query($query);

        $this->wpdb->show_errors();
    }

    public function wipeTestDataFromPost($postId) {
        $this->wpdb->hide_errors();

        // remove conditions
        $query = "
        DELETE `{$this->variantConditionTable}`
        FROM `{$this->variantConditionTable}`
        INNER JOIN `{$this->variantTable}` ON `{$this->variantConditionTable}`.variantId = `{$this->variantTable}`.id
        INNER JOIN `{$this->abTestTable}` ON `{$this->variantTable}`.testId = `{$this->abTestTable}`.id
        WHERE `{$this->abTestTable}`.postId = %d;
        ";

        $this->wpdb->query($this->wpdb->prepare($query, $postId));

        // remove variations and test data
        $query = "
        DELETE `{$this->variantTable}`, `{$this->abTestTable}`
        FROM `{$this->variantTable}`
        INNER JOIN `{$this->abTestTable}` ON `{$this->variantTable}`.testId = `{$this->abTestTable}`.id
        WHERE `{$this->abTestTable}`.postId = %d;
        ";

        $this->wpdb->query($this->wpdb->prepare($query, $postId));

        $this->wpdb->show_errors();
    }

    public function archiveTestDataFromPost($postId) {
        $this->wpdb->hide_errors();

        $query = "UPDATE `{$this->abTestTable}` SET isArchived = 1 WHERE postId = %d";
        $this->wpdb->query($this->wpdb->prepare($query, $postId));

        $this->wpdb->show_errors();
    }

    public function insertTest($postId, $testData) {
        $isEnabled = isset($testData['isEnabled']) && (bool) $testData['isEnabled'] ? 1 : 0;
        $startedAt = isset($testData['startedAt']) ? $testData['startedAt'] : '';
        $postGoal = isset($testData['postGoal']) ? $testData['postGoal'] : 0;

        $query = $this->wpdb->prepare("
            REPLACE INTO `{$this->abTestTable}`
            (id, postId, isEnabled, startedAt, title, control, postGoal, postGoalType, isArchived)
            VALUES (%s, %s, %d, %s, %s, %s, %s, %s, %d);
            ",
            $testData['id'],
            $postId,
            $isEnabled,
            $startedAt,
            $testData['title'],
            $testData['control'],
            $postGoal,
            $testData['postGoalType'],
            0
        );

        $this->wpdb->hide_errors();

        $this->wpdb->query($query);

        $this->wpdb->show_errors();
    }

    public function updateTest($testData) {
        $currentData = $this->getTestById($testData['id']);

        if (
            $testData["isEnabled"]
            && $currentData["startedAt"] === "0000-00-00 00:00:00"
        ) {
            $testData["startedAt"] = date("Y-m-d H:i");
        }

        $mergedData = array_merge($currentData, $testData);

        $this->insertTest($mergedData['postId'], $mergedData);

        return $this->mapToOutput($mergedData);
    }

    public function insertVariant($testId, $variant) {
        list($participants, $conversions) = $this->getStatsByVariation($variant['id']);

        $query = "
        REPLACE INTO `{$this->variantTable}` (id, testId, name, participants, conversions)
        VALUES (%s, %s, %s, %d, %d);
        ";

        $this->wpdb->hide_errors();

        $this->wpdb->query($this->wpdb->prepare(
            $query,
            $variant['id'],
            $testId,
            $variant['name'],
            $participants,
            $conversions
        ));

        $this->wpdb->show_errors();
    }

    public function insertVariantCondition($variant, $condition) {
        $query = "
        INSERT INTO `{$this->variantConditionTable}` (`variantId`, `key`, `value`)
        VALUES (%s, %s, %s);
        ";

        $prepared = $this->wpdb->prepare(
            $query,
            $variant['id'],
            $condition['key'],
            $condition['value']
        );

        $this->wpdb->hide_errors();

        $this->wpdb->query($prepared);

        $this->wpdb->show_errors();
    }

}
