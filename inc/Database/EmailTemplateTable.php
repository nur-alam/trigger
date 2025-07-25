<?php
/**
 * The EmailTemplateTable class defines a database table schema
 * for storing email template information.
 *
 * @package Trigger\Database
 * @subpackage Trigger\Database\EmailTemplateTable
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * EmailTemplateTable class for creating & dropping table
 */
class EmailTemplateTable extends DatabaseAbstract {

	/**
	 * Table name without prefix
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $name = 'email_templates';

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
			`name` VARCHAR(255) NOT NULL,
			`description` TEXT,
			`components` LONGTEXT NOT NULL,
			`thumbnail` VARCHAR(500),
			`is_active` TINYINT(1) DEFAULT 1,
			`created_by` BIGINT UNSIGNED,
			`created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
			`updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX `idx_name` (`name`),
			INDEX `idx_created_by` (`created_by`),
			INDEX `idx_is_active` (`is_active`)
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
	}
}