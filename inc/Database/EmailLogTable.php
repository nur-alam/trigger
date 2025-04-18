<?php
/**
 * The CustomerTable class defines a database table schema
 * for storing customer information.
 *
 * @package Trigger\Database
 * @subpackage Trigger\Database\EmailLogTable
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * EmailLogTable class for creating & dropping table
 */
class EmailLogTable extends DatabaseAbstract {

	/**
	 * Table name without prefix
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $name = 'email_logs';

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
			`provider` VARCHAR(30),
			`status` VARCHAR(30),
			`mail_to` VARCHAR(30),
			`mail_from` VARCHAR(30),
			`subject` VARCHAR(100),
			`message` TEXT,
			`headers` TEXT,
			`attachments` TEXT,
			`created_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			`updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
