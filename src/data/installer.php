<?php

namespace ABTestingForWP;

class Installer {

    public function __construct($fileRoot) {
        register_activation_hook($fileRoot, [$this, 'install']);
    }
    
    public function install() {
        $this->createTables();
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