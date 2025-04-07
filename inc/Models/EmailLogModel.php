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
				'provider'    => sanitize_text_field( $data['provider'] ),
				'status'      => sanitize_text_field( $data['status'] ),
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
	 * Get total count of email logs.
	 *
	 * @param string $search Optional search term for subject or mail_to.
	 * @return int Total number of email logs.
	 */
	private function get_total_count( $search = '' ) {
		global $wpdb;

		if ( ! empty( $search ) ) {
			return (int) $wpdb->get_var(
				$wpdb->prepare(
					'SELECT COUNT(*) FROM `' . esc_sql( $this->table_name ) . '` 
					WHERE subject LIKE %s OR mail_to LIKE %s',
					'%' . $wpdb->esc_like( $search ) . '%',
					'%' . $wpdb->esc_like( $search ) . '%'
				)
			);
		}

		return (int) $wpdb->get_var(
			$wpdb->prepare(
				'SELECT COUNT(*) FROM `' . esc_sql( $this->table_name ) . '`'
			)
		);
	}

	/**
	 * Get all email logs from the database with pagination and filtering.
	 *
	 * @param array $args {
	 *     Optional. Arguments to filter and paginate results.
	 *     @type int    $page           Current page number. Default 1.
	 *     @type int    $per_page       Items per page. Default 10.
	 *     @type string $search         Search term for subject or mail_to.
	 * }
	 * @return array {
	 *     @type array  $data    Array of email logs
	 *     @type array  $meta    Pagination metadata
	 * }
	 */
	public function get_all_email_logs( $args = array() ) {
		global $wpdb;

		// Set default arguments
		$defaults = array(
			'page'     => 1,
			'per_page' => 10,
			'search'   => '',
		);
		$args     = wp_parse_args( $args, $defaults );

		// Ensure positive integers for pagination
		$page     = max( 1, intval( $args['page'] ) );
		$per_page = max( 1, intval( $args['per_page'] ) );
		$offset   = ( $page - 1 ) * $per_page;

		// Get total count for pagination
		$total       = $this->get_total_count( $args['search'] );
		$total_pages = ceil( $total / $per_page );

		// Build and execute query
		$email_logs = array();
		if ( ! empty( $args['search'] ) ) {
			$email_logs = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM `' . esc_sql( $this->table_name ) . '` 
					WHERE subject LIKE %s OR mail_to LIKE %s 
					ORDER BY created_at DESC 
					LIMIT %d OFFSET %d',
					'%' . $wpdb->esc_like( $args['search'] ) . '%',
					'%' . $wpdb->esc_like( $args['search'] ) . '%',
					$per_page,
					$offset
				)
			);
		} else {
			$email_logs = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM `' . esc_sql( $this->table_name ) . '` 
					ORDER BY created_at DESC 
					LIMIT %d OFFSET %d',
					$per_page,
					$offset
				)
			);
		}

		if ( null === $email_logs ) {
			$email_logs = array();
		}

		return array(
			'email_logs' => $email_logs,
			'meta'       => array(
				'total'        => $total,
				'per_page'     => $per_page,
				'current_page' => $page,
				'total_pages'  => $total_pages,
			),
		);
	}

	/**
	 * Bulk delete email logs
	 *
	 * @param array $ids Array of email log IDs to delete.
	 * @return bool True if logs were deleted, false otherwise.
	 */
	public function bulk_delete_email_logs( $ids ) {
		global $wpdb;
		try {
			if ( empty( $ids ) ) {
				return false;
			}

			// Handle if IDs come as a string
			if ( is_string( $ids ) ) {
				$ids = explode( ',', $ids );
			}

			// Ensure we have an array
			if ( ! is_array( $ids ) ) {
				return false;
			}

			// Clean the IDs
			$ids = array_filter( array_map( 'absint', $ids ) );
			if ( empty( $ids ) ) {
				return false;
			}

			// Start transaction
			$wpdb->query( 'START TRANSACTION' );

			$success = true;
			foreach ( $ids as $id ) {
				$result = $wpdb->delete(
					$this->table_name,
					array( 'id' => $id ),
					array( '%d' )
				);
				if ( false === $result ) {
					$success = false;
					break;
				}
			}

			// Commit or rollback based on success
			if ( $success ) {
				$wpdb->query( 'COMMIT' );
				return true;
			} else {
				$wpdb->query( 'ROLLBACK' );
				return false;
			}
		} catch ( \Throwable $th ) {
			$wpdb->query( 'ROLLBACK' );
			return false;
		}
	}

	/**
	 * Get email stats
	 *
	 * @return mixed array|WP_Error
	 */
	public function get_email_stats() {
		global $wpdb;

		$total_logs = (int) $wpdb->get_var(
			$wpdb->prepare(
				'SELECT COUNT(*) FROM `' . esc_sql( $this->table_name ) . '`'
			)
		);

		$total_success_logs = (int) $wpdb->get_var(
			$wpdb->prepare(
				'SELECT COUNT(*) FROM `' . esc_sql( $this->table_name ) . '` WHERE status = %s',
				'success'
			)
		);

		$total_failed_logs = $total_logs - $total_success_logs;

		$chart_data = array();
		for ( $i = 0; $i < 7; $i++ ) {
			$date         = gmdate( 'Y-m-d', strtotime( '+' . $i . ' day' ) );
			$success_logs = (int) $wpdb->get_var(
				$wpdb->prepare(
					'SELECT COUNT(*) FROM `' . esc_sql( $this->table_name ) . '` WHERE status = %s AND created_at LIKE %s',
					'success',
					'%' . $date . '%'
				)
			);
			$chart_data[] = array(
				'date'    => $date,
				'success' => $success_logs,
			);
		}

		return array(
			'total'      => $total_logs,
			'success'    => $total_success_logs,
			'failed'     => $total_failed_logs,
			'chart_data' => $chart_data,
		);
	}
}
