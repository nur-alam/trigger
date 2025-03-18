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
		add_action( 'wp_ajax_update_email_config', array( $this, 'update_email_config' ) );
		add_action( 'wp_ajax_trigger_fetch_email_config', array( $this, 'fetch_email_config' ) );
		add_action( 'wp_ajax_trigger_send_test_email', array( $this, 'send_test_email' ) );
		add_action( 'wp_ajax_get_email_connections', array( $this, 'get_email_connections' ) );
	}

	/**
	 * Update email configuration
	 *
	 * @return object
	 */
	public function update_email_config() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$data   = json_decode( $params['data'], true );

		// Get existing config
		$existing_config = get_option( TRIGGER_EMAIL_CONFIG, array() );
		$config          = $existing_config;

		if ( 'smtp' === $data['provider'] ) {
			$config['smtp'] = array(
				'provider'      => sanitize_text_field( $data['provider'] ),
				'from_name'     => sanitize_text_field( $data['fromName'] ),
				'from_email'    => sanitize_email( $data['fromEmail'] ),
				'smtp_host'     => sanitize_text_field( $data['smtpHost'] ),
				'smtp_port'     => sanitize_text_field( $data['smtpPort'] ),
				'smtp_security' => sanitize_text_field( $data['smtpSecurity'] ),
				'smtp_username' => sanitize_text_field( $data['smtpUsername'] ),
				'smtp_password' => sanitize_text_field( $data['smtpPassword'] ),
			);
		} elseif ( 'ses' === $data['provider'] ) {
			$config['ses'] = array(
				'provider'          => sanitize_text_field( $data['provider'] ),
				'from_name'         => sanitize_text_field( $data['fromName'] ),
				'from_email'        => sanitize_email( $data['fromEmail'] ),
				'access_key_id'     => sanitize_text_field( $data['accessKeyId'] ),
				'secret_access_key' => sanitize_text_field( $data['secretAccessKey'] ),
				'region'            => sanitize_text_field( $data['region'] ),
			);
		} else {
			return $this->json_response( __( 'Invalid provider', 'trigger' ), null, 400 );
		}

		$config[ $data['provider'] ]['created_at'] = current_time( 'mysql' );

		update_option( TRIGGER_EMAIL_CONFIG, $config );

		return $this->json_response( __( 'Email configuration updated successfully', 'trigger' ), null, 200 );
	}

	/**
	 * Fetch email configuration
	 *
	 * @return object
	 */
	public function fetch_email_config() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$config = get_option( TRIGGER_EMAIL_CONFIG, array() );

		return $this->json_response( __( 'Email configuration fetched successfully', 'trigger' ), $config, 200 );
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
			'to_email' => 'required|email',
		);

		$validation_response = ValidationHelper::validate( $validation_rules, $params );
		if ( ! $validation_response->success ) {
			return $this->json_response( $validation_response->message, null, 400 );
		}

		$subject = __( 'Test Email from Trigger', 'trigger' );
		$message = __( 'This is a test email sent from Trigger plugin.', 'trigger' );
		$headers = array( 'Content-Type: text/html; charset=UTF-8' );

		$sent = wp_mail( $to_email, $subject, $message, $headers );

		if ( $sent ) {
				return $this->json_response( __( 'Test email sent successfully', 'trigger' ), null, 200 );
		} else {
			return $this->json_response( __( 'Failed to send test email', 'trigger' ), null, 400 );
		}
	}

	/**
	 * Get email connections
	 *
	 * @return object
	 */
	public function get_email_connections() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$config = get_option( TRIGGER_EMAIL_CONFIG, array() );

		if ( empty( $config ) ) {
			return $this->json_response( __( 'No email connections found', 'trigger' ), array(), 200 );
		}

		// Transform config object into array format
		$connections = array();
		foreach ( $config as $provider => $settings ) {
			$connections[] = $settings;
		}

		return $this->json_response( __( 'Email connections fetched successfully', 'trigger' ), $connections, 200 );
	}
}
