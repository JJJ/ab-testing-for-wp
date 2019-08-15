<?php

namespace ABTestingForWP;

class Installer {

    private $migrations = [
        'addGoalTypeColumn',
        'fillInGoalType',
        'addTitleColumn',
        'fillInTitle',
    ];

    public function __construct($fileRoot) {
        register_activation_hook($fileRoot, [$this, 'install']);
        add_action('init', [$this, 'runMigrations'], 1);
    }

    public function install() {
        $this->createTables();
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

            $wpdb->hide_errors();

            $tablePrefix = $wpdb->prefix;

            foreach($migrationsToRun as $methodName) {
                $wpdb->query($this->$methodName($tablePrefix));
            }

            // update last run migration to last in line
            $optionsManager->setOption('lastMigration', $lastMigrationToBeAt);
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
        WHERE t.name IS NULL";
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

    private function createTables() {
        global $wpdb;

        $wpdb->hide_errors();

        $collate = $this->getDBCollate();

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
            `name` varchar(255) DEFAULT NULL,
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
