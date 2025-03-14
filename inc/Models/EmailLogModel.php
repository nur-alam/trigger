<?php
/**
 * Enqueue Assets, styles & scripts
 *
 * @package Trigger\Models
 * @subpackage Trigger\Models\EmailLogModel
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Models;

use Trigger\Database\EmailLogTable;
use Trigger\Helpers\QueryHelper;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Words database operation management
 */
class EmailLogModel {

	/**
	 * Table name
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $table_name;

	/**
	 * Resolve dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->table_name = ( new EmailLogTable() )->get_table_name();
	}

	/**
	 * Get_words from word table.
	 *
	 * @param array $data field as per database table.
	 *
	 * @return array
	 */
	public function get_email_logs( $data ) {
		global $wpdb;
		$order           = $data['order'];
		$query           = $wpdb->prepare( "SELECT COUNT(*) FROM $this->table_name" );
		$email_log_count = $wpdb->get_var( $query ); //phpcs:ignore
		if ( ! $data['search'] ) {
			$query  = $wpdb->prepare(
				"SELECT * FROM $this->table_name 
					ORDER BY id $order LIMIT %d OFFSET %d",
				$data['limit'],
				$data['offset']
			);
			$result = $wpdb->get_results( $query ); //phpcs:ignore
		} else {
			$like   = '%' . $data['search'] . '%';
			$query  = $wpdb->prepare(
				"SELECT * FROM $this->table_name 
					WHERE email_log LIKE %s LIMIT %d OFFSET %d",
				$like,
				$data['limit'],
				$data['offset']
			);
			$result = $wpdb->get_results( $query ); //phpcs:ignore
			return array(
				'count'   => (int) count( $result ),
				'results' => $result,
			);
		}
		return array(
			'count'   => (int) $email_log_count,
			'results' => $result,
		);
	}

	/**
	 * Create_email_log in email_logs table.
	 *
	 * @param array $data field as per database table.
	 *
	 * @return integer
	 */
	public function create_email_log( $data ) {
		global $wpdb;
		try {
			$insert = $wpdb->insert(
				$this->table_name,
				$data
			);
		} catch ( \Throwable $th ) {
			return wp_send_json_error( $th );
		}

		return $insert;
	}

	/**
	 * Update_email_log in email_logs table.
	 *
	 * @param array $data field as per database table.
	 *
	 * @return integer
	 */
	public function update_email_log( $data ) {
		global $wpdb;
		try {
			$update = $wpdb->update(
				$this->table_name,
				$data,
				array( 'id' => $data['id'] )
			);
		} catch ( \Throwable $th ) {
			return wp_send_json_error( $th );
		}

		return $update;
	}

	/**
	 * Delete_email_log in email_logs table.
	 *
	 * @param array $email_log field as per database table.
	 *
	 * @return integer
	 */
	public function delete_email_log( $email_log ) {
		global $wpdb;
		try {
			$deleted = $wpdb->delete(
				$this->table_name,
				array( 'id' => $email_log['id'] )
			);
		} catch ( \Throwable $th ) {
			return wp_send_json_error( $th );
		}

		return $deleted;
	}

	/**
	 * Get all email logs from the database.
	 *
	 * @since 1.0.0
	 *
	 * @return array {
	 *     @type bool   $success Whether the query was successful
	 *     @type string $message Response message
	 *     @type array  $data    Array of email logs
	 * }
	 */
	public function get_all_email_logs() {
		global $wpdb;

		try {
			$results = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM `' . esc_sql( $this->table_name ) . '` ORDER BY created_at DESC'
				)
			);

			if ( null === $results ) {
				return array(
					'success' => false,
					'message' => 'Failed to fetch email logs',
					'data'    => array(),
				);
			}

			return array(
				'success' => true,
				'message' => 'Email logs fetched successfully',
				'data'    => $results,
			);

		} catch ( \Throwable $th ) {
			return array(
				'success' => false,
				'message' => $th->getMessage(),
				'data'    => array(),
			);
		}
	}
}
