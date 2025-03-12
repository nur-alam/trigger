<?php
/**
 * The CustomerTable class defines a database table schema
 * for storing customer information.
 *
 * @package Trigger\Database
 * @subpackage Trigger\Database\WordTable
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WordTable class for creating & dropping table
 */
class WordTable extends DatabaseAbstract {

	/**
	 * Table name without prefix
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $name = 'words';

	/**
	 * This function sets the name property of an object to the WordPress
	 * database table prefix concatenated with the object's name property.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		global $wpdb;
		$this->name = $wpdb->prefix . self::PREFIX . $this->name;
	}

	/**
	 * Get the name of the table with prefix
	 *
	 * @since 1.0.0
	 *
	 * @return string A string representing the name of a table.
	 */
	public function get_table_name(): string {
		return $this->name;
	}


	/**
	 * The function returns a string containing the SQL schema for creating a table with specific columns
	 * and constraints.
	 *
	 * @since 1.0.0
	 *
	 * @return string a string that represents the SQL schema for creating a table.
	 */
	public function get_table_schema(): string {
		$schema = "CREATE TABLE {$this->name} (
                `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                `user_id` BIGINT UNSIGNED NOT NULL,
				`read_count` INT DEFAULT 0,
                `word` VARCHAR(45),
                `description` TEXT,
				`status` VARCHAR(20),
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
				-- INDEX idx_user_id (user_id)
            ) ENGINE = INNODB ";
		return $schema;
	}

	/**
	 * Create the table
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function create_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = $this->get_table_schema() . $charset_collate;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );

		// global $wpdb;

		// $charset_collate = $wpdb->get_charset_collate();

		// $schema = "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}addresses` (
		// `id` int unsigned NOT NULL AUTO_INCREMENT,
		// `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
		// `address` varchar(255) DEFAULT NULL,
		// `phone` varchar(30) DEFAULT NULL,
		// `created_by` bigint unsigned NOT NULL,
		// `created_at` datetime NOT NULL,
		// PRIMARY KEY (`id`)
		// ) $charset_collate";

		// if ( ! file_exists( 'dbDelta' ) ) {
		// require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		// }

		// dbDelta( $schema );
	}
}
