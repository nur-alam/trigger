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

use Trigger\Models\EmailLogModel;
use Trigger\Traits\JsonResponse;
use Trigger\Traits\RestResponse;
use Trigger\Controllers\Provider\aws\SesMailer;
use Trigger\Controllers\Provider\gmail\GMailer;
use Trigger\Core\TriggerMailer;
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
		add_filter( 'wp_mail_succeeded', array( $this, 'create_email_log' ) );
		add_filter( 'wp_mail_failed', array( $this, 'create_failed_email_log' ) );
		add_action( 'wp_ajax_get_email_stats', array( $this, 'get_email_stats' ) );
		add_action( 'wp_ajax_trigger_fetch_email_logs', array( $this, 'get_email_logs' ) );
		add_action( 'wp_ajax_trigger_delete_email_log', array( $this, 'delete_email_log' ) );
		add_action( 'wp_ajax_trigger_bulk_delete_email_logs', array( $this, 'bulk_delete_email_logs' ) );
		add_action( 'wp_ajax_trigger_send_test_email', array( $this, 'send_test_email' ) );
		add_action( 'wp_ajax_trigger_resend_email', array( $this, 'trigger_resend_email' ) );
		// add_action( 'admin_init', array( $this, 'handle_google_oauth_callback' ) );
		add_action( 'wp_ajax_handle_google_oauth_callback', array( $this, 'handle_google_oauth_callback' ) );
	}

	/**
	 * Handle Gmail Mailer callback
	 */
	public function handle_google_oauth_callback() {
		$provider = trigger_get_provider( 'gmail' );
		// Verify nonce for security.
		$data = trigger_verify_request( true );
		$code = $data['data']['code'];

		if ( ! empty( $code ) && null !== $provider && 'gmail' === $provider['provider'] ) {
			$response = wp_remote_post(
				'https://oauth2.googleapis.com/token',
				array(
					'body' => array(
						'code'          => $code,
						'client_id'     => $provider['clientId'],
						'client_secret' => $provider['clientSecret'],
						'redirect_uri'  => TRIGGER_REDIRECT_URI,
						'grant_type'    => 'authorization_code',
					),
				)
			);
			$body     = json_decode( wp_remote_retrieve_body( $response ), true );
			if ( isset( $body['access_token'] ) ) {
				update_option( GMAIL_AUTH_CREDENTIALS, $body );
				return $this->json_response( 'Gmail connected successfully!', null, 200 );
				// wp_safe_redirect( admin_url( 'admin.php?page=trigger#/connections?google_gmail_redirect=true' ) );
			} else {
				return $this->json_response( 'Gmail connection failed!', null, 400 );
				// wp_safe_redirect( admin_url( 'admin.php?page=trigger#/connections?google_gmail_redirect_failed=true' ) );
			}
		}
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
				return false;
			} else {
				return true;
			}
		} catch ( \Throwable $th ) {
			// error_log( 'Failed to log email: ' . $th->getMessage() );
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
				return false;
			} else {
				return true;
			}
		} catch ( \Throwable $th ) {
			// error_log( 'Failed to log email: ' . $th->getMessage() );
			return true;
		}
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
			'page'       => isset( $params['page'] ) ? absint( $params['page'] ) : 1,
			'per_page'   => isset( $params['per_page'] ) ? absint( $params['per_page'] ) : 10,
			'search'     => isset( $params['search'] ) ? sanitize_text_field( $params['search'] ) : '',
			'sort_by'    => isset( $params['sort_by'] ) ? sanitize_text_field( $params['sort_by'] ) : 'created_at',
			'sort_order' => isset( $params['sort_order'] ) ? sanitize_text_field( $params['sort_order'] ) : 'desc',
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

		$validation_rules = array(
			'to'       => 'required|email',
			'provider' => 'required',
		);

		$validation_response = ValidationHelper::validate( $validation_rules, $params );
		if ( ! $validation_response->success ) {
			return $this->json_response( $validation_response->message, null, 400 );
		}

		$subject = __( 'Test Email from Trigger', 'trigger' );
		$message = __( 'This is a test email sent from Trigger plugin.', 'trigger' );
		$headers = array( 'Content-Type: text/html; charset=UTF-8' );

		// Get email configuration
		$email_config = get_option( TRIGGER_EMAIL_CONFIG, array() );
		$provider     = $params['provider'];
		if ( empty( $email_config ) || ! isset( $email_config[ $provider ] ) ) {
			return $this->json_response( __( 'Email configuration not found', 'trigger' ), null, 404 );
		}

		$config = $email_config[ $provider ];

		if ( 'ses' === $provider ) {
			$ses_mailer = new SesMailer();
			$sent       = $ses_mailer->send_email( $params['to'], $subject, $message, $headers, $config, true );
		} elseif ( 'gmail' === $provider ) {
			$gmailer = new GMailer();
			$sent    = $gmailer->send_email( $params['to'], $subject, $message, $headers, true );
		} else {
			// For all other providers, use wp_mail
			$sent = ( new TriggerMailer() )->trigger_wp_mail( $params['to'], $subject, $message, $headers );
		}

		if ( $sent ) {
			if ( 'smtp' !== $provider ) {
				do_action(
					'wp_mail_succeeded',
					array(
						'to'      => $params['to'],
						'subject' => $subject,
						'message' => $message,
						'headers' => $headers,
					)
				);
			}
			return $this->json_response( __( 'Test email sent successfully', 'trigger' ), null, 200 );
		} else {
			if ( 'smtp' !== $provider ) {
				do_action(
					'wp_mail_failed',
					new \WP_Error(
						'wp_mail_failed',
						__( 'Failed to send test email', 'trigger' ),
						array(
							'to'      => $params['to'],
							'subject' => $subject,
							'message' => $message,
							'headers' => $headers,
						)
					)
				);
			}
			return $this->json_response( __( 'Failed to send test email', 'trigger' ), null, 400 );
		}
	}

	/**
	 * Resend email
	 *
	 * @param array $params Array containing the email data.
	 * @return object
	 */
	public function trigger_resend_email( $params ) {
		try {
			$verify = trigger_verify_request();
			if ( ! $verify['success'] ) {
				return $this->json_response( $verify['message'], null, $verify['code'] );
			}

			$params = $verify['data'];

			$default_provider = trigger_get_default_provider();
			$provider         = $default_provider['provider'];

			if ( 'ses' === $provider ) {
				$ses_mailer = new SesMailer();
				$sent       = $ses_mailer->send_email( $params['to'], $params['subject'], $params['message'], $params['headers'], array(), true );
			} elseif ( 'gmail' === $provider ) {
				$gmailer = new GMailer();
				$sent    = $gmailer->send_email( $params['to'], $params['subject'], $params['message'], $params['headers'], array(), true );
			} else {
				// For all other providers, use wp_mail
				$sent = ( new TriggerMailer() )->trigger_wp_mail( $params['to'], $params['subject'], $params['message'], $params['headers'] );
			}

			if ( $sent ) {
				if ( 'smtp' !== $provider ) {
					do_action(
						'wp_mail_succeeded',
						array(
							'to'      => $params['to'],
							'subject' => $params['subject'],
							'message' => $params['message'],
							'headers' => $params['headers'],
						)
					);
				}
				return $this->json_response( __( 'Test email sent successfully', 'trigger' ), null, 200 );
			} else {
				if ( 'smtp' !== $provider ) {
					do_action(
						'wp_mail_failed',
						new \WP_Error(
							'wp_mail_failed',
							__( 'Failed to send test email', 'trigger' ),
							array(
								'to'      => $params['to'],
								'subject' => $params['subject'],
								'message' => $params['message'],
								'headers' => $params['headers'],
							)
						)
					);
				}
				return $this->json_response( __( 'Failed to send test email', 'trigger' ), null, 400 );
			}
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error resending email: ' . $th->getMessage(), null, 500 );
		}
	}
}
