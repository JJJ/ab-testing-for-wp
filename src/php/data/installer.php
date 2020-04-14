<?php

namespace ABTestingForWP;

class Installer {

    private $migrations = [
        'addGoalTypeColumn',
        'fillInGoalType',
        'addTitleColumn',
        'fillInTitle',
        'postGoalToVarchar',
        'addVariantConditions',
    ];

    public function __construct($fileRoot) {
        if ($fileRoot) {
            register_activation_hook($fileRoot, [$this, 'install']);
            add_action('init', [$this, 'runMigrations'], 1);
        }
    }

    public function install() {
        $this->createTables();
    }

    public function uninstall() {
        $this->removeTables();
    }

    public function runMigrations() {
        $optionsManager = new OptionsManager();
        $lastMigration = $optionsManager->getOption('lastMigration', '');
        $lastMigrationToBeAt = $this->migrations[sizeof($this->migrations) - 1];

        if ($lastMigration !== $lastMigrationToBeAt) {
            // find index in array to start at
            $start = array_search($lastMigration, $this->migrations);
            $start = $start === false ? 0 : $start + 1;

            $migrationsToRun = array_slice($this->migrations, $start);

            // if for some reason the migrations are empty... abort
            if (sizeof($migrationsToRun) === 0) return;

            global $wpdb;

            $wpdb->show_errors();

            $tablePrefix = $wpdb->prefix;

            foreach($migrationsToRun as $methodName) {
                $wpdb->query($this->$methodName($tablePrefix));
            }

            // update last run migration to last in line
            $optionsManager->setOption('lastMigration', $lastMigrationToBeAt);
        }
    }

    public function repair() {
        // cache current tracking
        $abTestManager = new ABTestManager();
        $tracking = $abTestManager->getAllTracking();

        // wipe everything
        $this->uninstall();

        // install tables
        $this->install();

        // remove migration option
        $optionsManager = new OptionsManager();
        $optionsManager->setOption('lastMigration', '');

        // run the migrations
        $this->runMigrations();

        // look for tests and repopulate the database
        $this->repopulate();

        // restore tracking
        foreach ($tracking as $track) {
            $abTestManager->addTracking($track->variantId, $track->track, $track->date);
        }
    }

    private function repopulate() {
        $postActions = new PostsActions();
        $postTypes = get_post_types();

        $the_query = new \WP_Query([
            'nopaging' => true,
            's' => 'wp:ab-testing-for-wp/ab-test-block',
            'post_type' => $postTypes
        ]);

        if ($the_query->have_posts()) {
            while ($the_query->have_posts()) {
                $the_query->the_post();

                $postActions->updateBlockData(get_the_ID());
            }
        }
    }

    private function addGoalTypeColumn($tablePrefix) {
        return "ALTER TABLE `{$tablePrefix}ab_testing_for_wp_ab_test` ADD `postGoalType` VARCHAR(20) NULL DEFAULT NULL AFTER `postGoal`";
    }

    private function fillInGoalType($tablePrefix) {
        return "UPDATE `{$tablePrefix}ab_testing_for_wp_ab_test` AS t
        INNER JOIN `{$tablePrefix}posts` AS p on t.postGoal = p.ID
        SET t.postGoalType = p.post_type
        WHERE t.postGoalType IS NULL";
    }

    private function addTitleColumn($tablePrefix) {
        return "ALTER TABLE `{$tablePrefix}ab_testing_for_wp_ab_test` ADD `title` TEXT NULL AFTER `startedAt`";
    }

    private function fillInTitle($tablePrefix) {
        return "UPDATE `{$tablePrefix}ab_testing_for_wp_ab_test` AS t
        INNER JOIN `{$tablePrefix}posts` AS p on t.postId = p.ID
        SET t.title = CONCAT('Test \"', p.post_title, '\"')
        WHERE t.title IS NULL";
    }

    private function postGoalToVarchar($tablePrefix) {
        return "ALTER TABLE `{$tablePrefix}ab_testing_for_wp_ab_test` CHANGE `postGoal` `postGoal` VARCHAR(32) NULL DEFAULT NULL;";
    }

    private function addVariantConditions($tablePrefix) {
        $collate = $this->getDBCollate();
        $maxLength = $this->getMaxVarcharLength();

        return "CREATE TABLE IF NOT EXISTS `{$tablePrefix}ab_testing_for_wp_variant_condition` (
            `variantId` varchar(32) NOT NULL DEFAULT '',
            `key` varchar({$maxLength}) NOT NULL DEFAULT '',
            `value` varchar({$maxLength}) NOT NULL DEFAULT '',
            PRIMARY KEY (`variantId`, `key`, `value`)
        ) ENGINE = InnoDB {$collate};";
    }

    private function getDBCollate() {
		global $wpdb;
		$collate = '';

        if ($wpdb->has_cap('collation')) {
			if (!empty($wpdb->charset)) {
				$collate .= "DEFAULT CHARACTER SET $wpdb->charset";
            }

			if (!empty($wpdb->collate)) {
				$collate .= " COLLATE $wpdb->collate";
			}
        }

		return $collate;
    }

    private function getMaxVarcharLength() {
        global $wpdb;
        $collate = '';

        if ($wpdb->has_cap('collation')) {
            if ($wpdb->charset === 'utf8mb4') {
                return 191;
            }
        }

        return 255;
    }

    private function removeTables() {
        global $wpdb;

        $wpdb->show_errors();

        $tablePrefix = $wpdb->prefix;

        $tablesSql = [
            "DROP TABLE {$tablePrefix}ab_testing_for_wp_ab_test;",
            "DROP TABLE {$tablePrefix}ab_testing_for_wp_log;",
            "DROP TABLE {$tablePrefix}ab_testing_for_wp_variant;",
            "DROP TABLE {$tablePrefix}ab_testing_for_wp_variant_condition;"
        ];

        foreach($tablesSql as $sql) {
            $wpdb->query($sql);
        }
    }

    private function createTables() {
        global $wpdb;

        $wpdb->show_errors();

        $collate = $this->getDBCollate();
        $maxLength = $this->getMaxVarcharLength();

		$tablePrefix = $wpdb->prefix;

        $tablesSql = [];

        // AB Test table
        $tablesSql[] = "
		CREATE TABLE IF NOT EXISTS `{$tablePrefix}ab_testing_for_wp_ab_test` (
            `id` varchar(32) NOT NULL DEFAULT '',
            `postId` bigint(20) DEFAULT NULL,
            `isEnabled` tinyint(1) DEFAULT 0,
            `startedAt` datetime DEFAULT NULL,
            `control` varchar(32) DEFAULT NULL,
            `postGoal` bigint(20) DEFAULT NULL,
            `isArchived` tinyint(1) DEFAULT 0,
            PRIMARY KEY (`id`)
        ) ENGINE = InnoDB {$collate};";

        // AB Test Variant table
        $tablesSql[] = "
		CREATE TABLE IF NOT EXISTS `{$tablePrefix}ab_testing_for_wp_variant` (
            `id` varchar(32) NOT NULL DEFAULT '',
            `testId` varchar(32) DEFAULT NULL,
            `name` varchar({$maxLength}) DEFAULT NULL,
            `participants` int(11) DEFAULT 0,
            `conversions` int(11) DEFAULT 0,
            PRIMARY KEY (`id`)
        ) ENGINE = InnoDB {$collate};";

        // // Variant log table
        $tablesSql[] = "
		CREATE TABLE IF NOT EXISTS `{$tablePrefix}ab_testing_for_wp_log` (
            `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
            `variantId` varchar(32) NOT NULL DEFAULT '',
            `track` varchar(1) NOT NULL DEFAULT 'P',
            `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE = InnoDB {$collate};";

        foreach($tablesSql as $sql) {
			$wpdb->query($sql);
        }
    }

}
