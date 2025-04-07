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
use Trigger\Controllers\Provider\aws\AwsSesController;
use Trigger\Controllers\Provider\aws\SesMailer;
use Trigger\Helpers\ValidationHelper;

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
		new AwsSesController();
		new LogRetention();
		add_filter( 'wp_mail_succeeded', array( $this, 'create_email_log' ) );
		add_filter( 'wp_mail_failed', array( $this, 'create_failed_email_log' ) );
		add_action( 'wp_ajax_get_email_stats', array( $this, 'get_email_stats' ) );
		add_action( 'wp_ajax_trigger_fetch_email_logs', array( $this, 'get_email_logs' ) );
		add_action( 'wp_ajax_trigger_delete_email_log', array( $this, 'delete_email_log' ) );
		add_action( 'wp_ajax_trigger_bulk_delete_email_logs', array( $this, 'bulk_delete_email_logs' ) );
		add_action( 'wp_ajax_trigger_send_test_email', array( $this, 'send_test_email' ) );
	}

	/**
	 * Log successful email sends
	 *
	 * @param array $mail_data Array containing the mail data.
	 * @return bool
	 */
	public function create_email_log( $mail_data ) {
		$mail_to = $mail_data['to'];
		if ( ! empty( $mail_data['to'] ) && is_array( $mail_data['to'] ) ) {
			$mail_to = $mail_data['to'][0];
		}
		try {
			$email_log_model = new EmailLogModel();
			$smtp_settings   = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );
			$log_data        = array(
				'provider'    => $smtp_settings['provider'] ?? '',
				'status'      => 'success',
				'mail_to'     => $mail_to ?? '',
				'mail_from'   => $smtp_settings['fromEmail'] ?? '',
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
	 * Log failed email
	 *
	 * @param object $mail_failed_info Array containing the mail data.
	 * @return bool
	 */
	public function create_failed_email_log( $mail_failed_info ) {
		$wp_mail_failed   = $mail_failed_info->error_data;
		$mail_failed_data = $wp_mail_failed['wp_mail_failed'];
		if ( ! empty( $mail_failed_data['to'] ) && is_array( $mail_failed_data['to'] ) ) {
			$mail_to = $mail_failed_data['to'][0];
		}
		try {
			$email_log_model = new EmailLogModel();
			$smtp_settings   = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );
			$log_data        = array(
				'provider'    => $smtp_settings['provider'] ?? '',
				'status'      => 'failed',
				'mail_to'     => $mail_to ?? '',
				'mail_from'   => $smtp_settings['fromEmail'] ?? '',
				'subject'     => $mail_failed_data['subject'] ?? '',
				'message'     => $mail_failed_data['message'] ?? '',
				'headers'     => $mail_failed_data['headers'] ?? '',
				'attachments' => $mail_failed_data['attachments'] ?? '',
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
	 * Get email stats
	 *
	 * @return mixed array|WP_Error
	 */
	public function get_email_stats() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		try {
			$result = $this->email_log_model->get_email_stats();
			return $this->json_response( 'Email stats fetched successfully', $result, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error fetching email stats: ' . $th->getMessage(), null, 500 );
		}
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

	/**
	 * Send test email
	 *
	 * @return object
	 */
	public function send_test_email() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];

		$data = json_decode( $params['data'], true );

		$validation_rules = array(
			'sendTo'   => 'required|email',
			'provider' => 'required',
		);

		$validation_response = ValidationHelper::validate( $validation_rules, $data );
		if ( ! $validation_response->success ) {
			return $this->json_response( $validation_response->message, null, 400 );
		}

		$subject = __( 'AWS SES Test Email from Trigger', 'trigger' );
		$message = __( 'This is a test email sent from Trigger plugin.', 'trigger' );
		$headers = array( 'Content-Type: text/html; charset=UTF-8' );

		// Get email configuration
		$email_config = get_option( TRIGGER_EMAIL_CONFIG, array() );
		$provider     = $data['provider'];
		if ( empty( $email_config ) || ! isset( $email_config[ $provider ] ) ) {
			return $this->json_response( __( 'Email configuration not found', 'trigger' ), null, 404 );
		}

		$config = $email_config[ $provider ];

		// For SES provider, use SesMailer directly
		if ( 'ses' === $provider ) {
			$ses_mailer = new SesMailer();
			$sent       = $ses_mailer->send_email( $data['sendTo'], $subject, $message, $headers, $config );

			// $sent = wp_mail( $data['sendTo'], $subject, $message, $headers );
			// todo: need to write custom error log
			// file can be handleProviderTestMail.php

			if ( true === $sent ) {
				// $this->create_email_log( $data['sendTo'], $subject, $message, $headers );
				do_action(
					'wp_mail_succeeded',
					array(
						'to'      => $data['sendTo'],
						'subject' => $subject,
						'message' => $message,
						'headers' => $headers,
					)
				);
				return $this->json_response( __( 'Test email sent successfully', 'trigger' ), null, 200 );
			} else {
				// translators: %s is the error message returned from the AWS SES API
				return $this->json_response( __( 'Failed to send test email', 'trigger' ), null, 400 );
			}
		} else {
			// For all other providers, use wp_mail
			$sent = wp_mail( $data['sendTo'], $subject, $message, $headers );

			if ( $sent ) {
				return $this->json_response( __( 'Test email sent successfully', 'trigger' ), null, 200 );
			} else {
				return $this->json_response( __( 'Failed to send test email', 'trigger' ), null, 400 );
			}
		}
		// try {
		// } catch ( Exception $e ) {
		// $message = $e->getMessage();
		// return throw new Exception($e->getMessage());
		// return $this->json_response( __( 'Failed to send test email, please check your email credentials', 'trigger' ), null, 400 );
		// }
	}
}
