<?php
/**
 * SmtpConfig controller class
 *
 * @package Trigger\Controllers
 * @author Trigger <trigger@gmail.com>
 * @link https://trigger.com
 * @since 1.0.0
 */

namespace Trigger\Controllers\Provider\aws;

use Trigger\Traits\JsonResponse;
use Trigger\Controllers\Provider\aws\SesMailer;
use Trigger\Helpers\ValidationHelper;

/**
 * AwsSesController class
 */
class AwsSesController {

	use JsonResponse;

	/**
	 * Register hooks
	 */
	public function __construct() {
		add_action( 'wp_ajax_verify_ses_email', array( $this, 'verify_ses_email' ) );
		add_action( 'wp_ajax_get_verified_ses_emails', array( $this, 'get_verified_ses_emails' ) );
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
