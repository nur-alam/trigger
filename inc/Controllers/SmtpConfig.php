<?php
/**
 * SmtpConfig controller class
 *
 * @package Trigger\Controllers
 * @author Trigger <trigger@gmail.com>
 * @link https://trigger.com
 * @since 1.0.0
 */

namespace Trigger\Controllers;

use Exception;
use Trigger;
use Trigger\Helpers\CursorValidationHelper;
use Trigger\Helpers\UtilityHelper;
use Trigger\Helpers\ValidationHelper;
use Trigger\Traits\JsonResponse;


/**
 * SmtpConfig class
 */
class SmtpConfig {

	use JsonResponse;

	/**
	 * Register hooks
	 */
	public function __construct() {
		add_action( 'wp_ajax_update_smtp_config', array( $this, 'update_smtp_config' ) );
		add_action( 'wp_ajax_trigger_fetch_smtp_config', array( $this, 'trigger_fetch_smtp_config' ) );
		add_action( 'wp_ajax_trigger_send_test_email', array( $this, 'trigger_send_test_email' ) );
	}

	/**
	 * Dev tools email settings description
	 *
	 * @return  array
	 */
	public function update_smtp_config() {
		// Verify authentication and nonce
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$rules  = array(
			'action'        => 'required|string',
			'trigger_nonce' => 'required|string',
			'smtpHost'      => 'required|string',
			'smtpPort'      => 'required|numeric',
			'smtpSecurity'  => 'required|string',
			'smtpUsername'  => 'required|string',
			'smtpPassword'  => 'required|string',
			'fromName'      => 'required|string',
			'fromEmail'     => 'required|email',
		);

		$validator = ValidationHelper::validate( $rules, $params );
		if ( ! $validator->success ) {
			return $this->json_response( 'Validation failed!', array( 'errors' => $validator->errors ), 400 );
		}

		try {
			// Save SMTP settings.
			$smtp_settings = array(
				'smtp_host'     => $params['smtpHost'],
				'smtp_port'     => $params['smtpPort'],
				'smtp_security' => $params['smtpSecurity'],
				'smtp_username' => $params['smtpUsername'],
				'smtp_password' => $params['smtpPassword'],
				'from_name'     => $params['fromName'],
				'from_email'    => $params['fromEmail'],
			);

			// Update WordPress options.
			update_option( TRIGGER_SMTP_CONFIG, $smtp_settings );

			return $this->json_response( 'SMTP settings saved successfully!', null, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( $th->getMessage(), null, 500 );
		}
	}

	/**
	 * Get SMTP settings.
	 *
	 * @return array
	 */
	public function trigger_fetch_smtp_config() {
		// Verify authentication and nonce
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		try {
			$smtp_settings = get_option( TRIGGER_SMTP_CONFIG, array() );
			return $this->json_response( 'SMTP settings retrieved successfully!', $smtp_settings, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( $th->getMessage(), null, 500 );
		}
	}

	/**
	 * Send test email.
	 *
	 * @return array
	 */
	public function trigger_send_test_email() {
		// Verify authentication and nonce
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$rules  = array(
			'action'        => 'required|string',
			'trigger_nonce' => 'required|string',
			'to_email'      => 'required|email',
		);

		$validator = ValidationHelper::validate( $rules, $params );
		if ( ! $validator->success ) {
			return $this->json_response( 'Validation failed!', array( 'errors' => $validator->errors ), 400 );
		}

		try {
			$to      = $params['to_email'];
			$subject = 'Trigger Test Email';
			$message = 'This is a test email from your WordPress site using SMTP configuration.';
			$headers = array( 'Content-Type: text/html; charset=UTF-8' );

			$sent = \wp_mail( $to, $subject, $message, $headers );

			if ( $sent ) {
				return $this->json_response( 'Test email sent successfully!', null, 200 );
			} else {
				return $this->json_response( 'Failed to send test email.', null, 400 );
			}
		} catch ( \Throwable $th ) {
			return $this->json_response( $th->getMessage(), null, 500 );
		}
	}
}
