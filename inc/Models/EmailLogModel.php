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
	 * Create_email_log in email_logs table.
	 *
	 * @param array $data {
	 *     Email log data.
	 *     @type string $mail_to      Recipient email address
	 *     @type string $mail_from    Sender email address
	 *     @type string $subject      Email subject
	 *     @type string $message      Email body content
	 *     @type string $headers      Email headers (optional)
	 *     @type string $attachments  Email attachments (optional)
	 * }
	 *
	 * @return array {
	 *     @type bool   $success Whether the log was created successfully
	 *     @type string $message Response message
	 *     @type int    $id      ID of the created log entry, or 0 if failed
	 * }
	 */
	public function create_email_log( $data ) {
		global $wpdb;

		try {

			// Sanitize and prepare data
			$log_data = array(
				'mail_to'     => sanitize_email( $data['mail_to'] ),
				'mail_from'   => sanitize_email( $data['mail_from'] ),
				'subject'     => sanitize_text_field( $data['subject'] ),
				'message'     => wp_kses_post( $data['message'] ),
				'headers'     => isset( $data['headers'] ) ? wp_json_encode( $data['headers'] ) : '',
				'attachments' => isset( $data['attachments'] ) ? wp_json_encode( $data['attachments'] ) : '',
				'created_at'  => current_time( 'mysql' ),
				'updated_at'  => current_time( 'mysql' ),
			);

			// Insert the log entry
			$inserted = $wpdb->insert(
				$this->table_name,
				$log_data,
				array(
					'%s', // mail_to
					'%s', // mail_from
					'%s', // subject
					'%s', // message
					'%s', // headers
					'%s', // attachments
					'%s', // created_at
					'%s',  // updated_at
				)
			);

			if ( false === $inserted ) {
				return array(
					'success' => false,
					'message' => 'Failed to create email log: ' . $wpdb->last_error,
					'id'      => 0,
				);
			}

			return array(
				'success' => true,
				'message' => 'Email log created successfully',
				'id'      => $wpdb->insert_id,
			);

		} catch ( \Throwable $th ) {
			return array(
				'success' => false,
				'message' => 'Error creating email log: ' . $th->getMessage(),
				'id'      => 0,
			);
		}
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
	 * @param integer $email_id field as per database table.
	 *
	 * @return integer
	 */
	public function delete_email_log( $email_id ) {
		global $wpdb;
		try {
			$deleted = $wpdb->delete(
				$this->table_name,
				array( 'id' => $email_id )
			);
		} catch ( \Throwable $th ) {
			return false;
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

		$email_logs = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM `' . esc_sql( $this->table_name ) . '` ORDER BY created_at DESC'
			)
		);

		if ( null === $email_logs ) {
			return array(
				'data' => array(),
			);
		}

		return array(
			'data' => $email_logs,
		);
	}
}
