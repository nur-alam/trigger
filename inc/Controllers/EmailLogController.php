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
			$smtp_settings   = get_option( TRIGGER_SMTP_CONFIG, array() );
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
		$data   = array(
			'order'  => ! empty( $params['order'] ) ? $params['order'] : 'DESC',
			'limit'  => $params['limit'] ?? 5,
			'offset' => $params['offset'] ?? 0,
			'search' => $params['search'] ?? '',
		);

		$result = $this->email_log_model->get_all_email_logs( $data );
		return $this->json_response( 'Email logs fetched successfully', $result['data'], 200 );
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
	// * @return  mixed WP_REST_Response|WP_Error
	// */
	// public function get_email_logs( WP_REST_Request $request ) {
	// $params = $request->get_params();
	// $data   = array(
	// 'order'  => ! empty( $params['order'] ) ? $params['order'] : 'DESC',
	// 'limit'  => $params['limit'] ?? 5,
	// 'offset' => $params['offset'] ?? 0,
	// 'search' => $params['search'] ?? '',
	// );
	// try {
	// $result = $this->email_log_model->get_email_logs( $data );
	// return $this->response( 'Email log updated successfully', $result );
	// } catch ( \Throwable $th ) {
	// return $this->response( 'Something went wrong!', '', $this->failed_code );
	// }
	// }

	// /**
	// * This function creates a Word in a PHP application after verifying the nonce,
	// * user privileges, and sanitizing the request.
	// *
	// * @since 1.0.0
	// *
	// * @param WP_REST_Request $request request object.
	// *
	// * @return mixed WP_REST_Response|WP_Error
	// */
	// public function create_email_log( WP_REST_Request $request ) {
	// $data = $request->get_params();
	// try {
	// $create_email_log = $this->email_log_model->create_email_log( $data );
	// if ( $create_email_log ) {
	// return $this->response( 'Email log updated successfully', $create_email_log );
	// } else {
	// return $this->response( 'Email log not updated!', $create_email_log );
	// }
	// } catch ( \Throwable $th ) {
	// return $this->response( 'Something went wrong!', '', $this->failed_code );
	// }
	// return wp_send_json( $create_word );
	// }

	// /**
	// * This function creates a plan in a PHP application after verifying the nonce,
	// * user privileges, and sanitizing the request.
	// *
	// * @since 1.0.0
	// *
	// * @param WP_REST_Request $request request object.
	// *
	// * @return mixed WP_REST_Response|WP_Error
	// */
	// public function update_email_log( WP_REST_Request $request ) {
	// $data             = $request->get_params();
	// $update_email_log = $this->email_log_model->update_email_log( $data );

	// return $this->response( 'Email log updated successfully', $update_email_log );
	// }

	// /**
	// * This function creates a plan in a PHP application after verifying the nonce,
	// * user privileges, and sanitizing the request.
	// *
	// * @since 1.0.0
	// *
	// * @param WP_REST_Request $request request object.
	// *
	// * @return mixed WP_REST_Response|WP_Error
	// */
	// public function delete_email_log( WP_REST_Request $request ) {
	// $data             = $request->get_params();
	// $delete_email_log = $this->email_log_model->delete_email_log( $data );

	// if ( ! $delete_email_log ) {
	// return wp_send_json_error( 'Something went wrong!' );
	// }

	// return wp_send_json( $delete_email_log );
	// }

	// /**
	// * Validate description.
	// *
	// * @return  [type]  [return description]
	// */
	// public function validate() {
	// return true;
	// }
}
