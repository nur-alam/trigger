<?php
/**
 * SmtpConfig controller class
 *
 * @package Trigger\Controllers
 * @author Trigger <trigger@gmail.com>
 * @link https://trigger.com
 * @since 1.0.0
 */

namespace Trigger\Controllers\Provider;

use Trigger\Helpers\ValidationHelper;
use Trigger\Traits\JsonResponse;
use Trigger\Core\SesMailer;
use Exception;

/**
 * AwsSesController class
 */
class AwsSesController {

	use JsonResponse;

	/**
	 * Register hooks
	 */
	public function __construct() {
		add_action( 'wp_ajax_trigger_send_test_email', array( $this, 'send_test_email' ) );
		add_action( 'wp_ajax_verify_ses_email', array( $this, 'verify_ses_email' ) );
		add_action( 'wp_ajax_get_verified_ses_emails', array( $this, 'get_verified_ses_emails' ) );
	}

	/**
	 * Send test email
	 *
	 * @return object
	 */
	public function send_test_email() {
		try {
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

				if ( true === $sent ) {
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
		} catch ( Exception $e ) {
			return $this->json_response( __( 'Failed to send test email, please check your email credentials', 'trigger' ), null, 400 );
		}
	}

	/**
	 * Verify email address with AWS SES
	 *
	 * @return object
	 */
	public function verify_ses_email() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$data   = json_decode( $params['data'], true );

		// Validation
		$validation_rules = array(
			'email'    => 'required|email',
			'provider' => 'required',
		);

		$validation_response = ValidationHelper::validate( $validation_rules, $data );
		if ( ! $validation_response->success ) {
			return $this->json_response( $validation_response->message, null, 400 );
		}

		// Get email configuration
		$email_config = get_option( TRIGGER_EMAIL_CONFIG, array() );
		$provider     = $data['provider'];

		if ( empty( $email_config ) || ! isset( $email_config[ $provider ] ) ) {
			return $this->json_response( __( 'Email configuration not found', 'trigger' ), null, 404 );
		}

		if ( 'ses' !== $provider ) {
			return $this->json_response( __( 'This feature is only available for AWS SES providers', 'trigger' ), null, 400 );
		}

		$config = $email_config[ $provider ];

		// Use SesMailer to verify email
		$ses_mailer = new SesMailer();
		$result     = $ses_mailer->verify_email_address( $data['email'], $config );

		if ( $result['success'] ) {
			return $this->json_response( $result['message'], null, 200 );
		} else {
			return $this->json_response( $result['message'], null, 400 );
		}
	}

	/**
	 * Get verified email addresses from AWS SES
	 *
	 * @return object
	 */
	public function get_verified_ses_emails() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$data   = json_decode( $params['data'], true );

		// Validation
		$validation_rules = array(
			'provider' => 'required',
		);

		$validation_response = ValidationHelper::validate( $validation_rules, $data );
		if ( ! $validation_response->success ) {
			return $this->json_response( $validation_response->message, null, 400 );
		}

		// Get email configuration
		$email_config = get_option( TRIGGER_EMAIL_CONFIG, array() );
		$provider     = $data['provider'];

		if ( empty( $email_config ) || ! isset( $email_config[ $provider ] ) ) {
			return $this->json_response( __( 'Email configuration not found', 'trigger' ), null, 404 );
		}

		if ( 'ses' !== $provider ) {
			return $this->json_response( __( 'This feature is only available for AWS SES providers', 'trigger' ), null, 400 );
		}

		$config = $email_config[ $provider ];

		// Use SesMailer to get verified emails
		$ses_mailer = new SesMailer();
		$result     = $ses_mailer->get_verified_emails( $config );

		if ( $result['success'] ) {
			return $this->json_response( $result['message'], isset( $result['data'] ) ? $result['data'] : array(), 200 );
		} else {
			return $this->json_response( $result['message'], null, 400 );
		}
	}
}
