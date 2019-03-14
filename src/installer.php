<?php

namespace ABTestingForWP;

class Installer {

    public function __construct($fileRoot) {
        register_activation_hook($fileRoot, [$this, 'install']);
    }
    
    public function install() {
        $this->createTables();
    }

    private function get_db_collate() {
		global $wpdb;
		$collate = '';
		if ( $wpdb->has_cap( 'collation' ) ) {
			if ( ! empty( $wpdb->charset ) ) {
				$collate .= "DEFAULT CHARACTER SET $wpdb->charset";
			}
			if ( ! empty( $wpdb->collate ) ) {
				$collate .= " COLLATE $wpdb->collate";
			}
		}
		return $collate;
	}

    private function createTables() {
        global $wpdb;

        $wpdb->hide_errors();
        
        $collate = $this->get_db_collate();
        
		$table_prefix = $wpdb->prefix;

        $tables_sql = [];

        // AB Test table
        $tables_sql[] = "
		CREATE TABLE IF NOT EXISTS `{$table_prefix}ab_testing_for_wp_ab_test` (
            `id` varchar(32) NOT NULL DEFAULT '',
            `isEnabled` tinyint(11) DEFAULT NULL,
            `started` datetime DEFAULT NULL,
            `control` varchar(32) DEFAULT NULL,
            `postId` bigint(20) DEFAULT NULL,
            PRIMARY KEY (`id`)
        ) ENGINE = InnoDB {$collate};";

        // AB Test Variant table
        $tables_sql[] = "
		CREATE TABLE IF NOT EXISTS `{$table_prefix}ab_testing_for_wp_variant` (
            `id` varchar(32) NOT NULL DEFAULT '',
            `testId` varchar(32) DEFAULT NULL,
            `name` varchar(255) DEFAULT NULL,
            `participants` int(11) DEFAULT 0,
            `conversions` int(11) DEFAULT 0,
            PRIMARY KEY (`id`)
        ) ENGINE = InnoDB {$collate};";

        // // Variant log table
        $tables_sql[] = "
		CREATE TABLE IF NOT EXISTS `{$table_prefix}ab_testing_for_wp_log` (
            `variantId` varchar(32) NOT NULL DEFAULT '',
            `date` datetime NOT NULL,
            PRIMARY KEY (`variantId`,`date`)
        ) ENGINE = InnoDB {$collate};";
        
        foreach($tables_sql as $sql) {
			$wpdb->query($sql);
        }
    }

}