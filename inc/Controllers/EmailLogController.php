<?php
/**
 * EmailLogController logics
 *
 * @package Trigger\Controllers
 * @subpackage Trigger\Controllers\EmailLogController
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Controllers;

use Exception;
use Trigger\Models\EmailLogModel;
use Trigger\Traits\JsonResponse;
use Trigger\Traits\RestResponse;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * EmailLogController logics
 */
class EmailLogController {

	use RestResponse;
	use JsonResponse;

	/**
	 * Plan model
	 *
	 * @since 1.0.0
	 *
	 * @var object
	 */
	private $email_log_model;

	/**
	 * Get the model
	 *
	 * @since 1.0.0
	 *
	 * @return object
	 */
	public function get_model() {
		return $this->email_log_model;
	}

	/**
	 * Resolve dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->email_log_model = new EmailLogModel();
		add_filter( 'wp_mail', array( $this, 'create_email_log' ) );
		add_action( 'wp_ajax_trigger_fetch_email_logs', array( $this, 'get_email_logs' ) );
		add_action( 'wp_ajax_trigger_delete_email_log', array( $this, 'delete_email_log' ) );
		add_action( 'wp_ajax_trigger_bulk_delete_email_logs', array( $this, 'bulk_delete_email_logs' ) );
	}

	/**
	 * Log successful email sends
	 *
	 * @param array $mail_data Array containing the mail data.
	 * @return bool
	 */
	public function create_email_log( $mail_data ) {
		try {
			$email_log_model = new \Trigger\Models\EmailLogModel();
			$smtp_settings   = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );
			$log_data        = array(
				'mail_to'     => $mail_data['to'] ?? '',
				'mail_from'   => $smtp_settings['from_email'] ?? '',
				'subject'     => $mail_data['subject'] ?? '',
				'message'     => $mail_data['message'] ?? '',
				'headers'     => $mail_data['headers'] ?? '',
				'attachments' => $mail_data['attachments'] ?? '',
			);

			$email_log_created = $email_log_model->create_email_log( $log_data );
			if ( ! $email_log_created['success'] ) {
				error_log( 'Failed to log email: ' . $email_log_created['message'] );
			}
		} catch ( \Throwable $th ) {
			error_log( 'Failed to log email: ' . $th->getMessage() );
			return true;
		}
		return true;
	}

	/**
	 * Get email logs
	 *
	 * @return mixed array|WP_Error
	 */
	public function get_email_logs() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$args   = array(
			'page'     => isset( $params['page'] ) ? absint( $params['page'] ) : 1,
			'per_page' => isset( $params['per_page'] ) ? absint( $params['per_page'] ) : 10,
			'search'   => isset( $params['search'] ) ? sanitize_text_field( $params['search'] ) : '',
		);

		$result = $this->email_log_model->get_all_email_logs( $args );
		return $this->json_response( 'Email logs fetched successfully', $result, 200 );
	}

	/**
	 * Delete email log
	 *
	 * @return mixed array|WP_Error
	 */
	public function delete_email_log() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$id     = $params['id'];

		try {
			$result = $this->email_log_model->delete_email_log( $id );
			if ( ! $result ) {
				return $this->json_response( 'Failed to delete email log', null, 400 );
			}
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error deleting email log: ' . $th->getMessage(), null, 500 );
		}

		return $this->json_response( 'Email log deleted successfully', $result, 200 );
	}

	/**
	 * Bulk delete email logs
	 *
	 * @return mixed array|WP_Error
	 */
	public function bulk_delete_email_logs() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$ids    = json_decode( $params['ids'], true );

		try {
			$result = $this->email_log_model->bulk_delete_email_logs( $ids );
			if ( ! $result ) {
				return $this->json_response( 'Failed to delete email logs', null, 400 );
			}
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error deleting email logs: ' . $th->getMessage(), null, 500 );
		}

		return $this->json_response( 'Email logs deleted successfully', $result, 200 );
	}
}
