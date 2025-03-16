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
	}

	/**
	 * Update email configuration
	 *
	 * @return void
	 */
	public function update_email_config() {
		if ( ! check_ajax_referer( 'trigger_nonce', 'trigger_nonce', false ) ) {
			wp_send_json( $this->error( __( 'Invalid nonce', 'trigger' ) ) );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json( $this->error( __( 'Permission denied', 'trigger' ) ) );
		}

		$data = json_decode( stripslashes( $_POST['data'] ), true );
		if ( ! $data ) {
			wp_send_json( $this->error( __( 'Invalid data', 'trigger' ) ) );
		}

		$config = array(
			'provider'   => sanitize_text_field( $data['provider'] ),
			'from_name'  => sanitize_text_field( $data['fromName'] ),
			'from_email' => sanitize_email( $data['fromEmail'] ),
		);

		if ( 'smtp' === $config['provider'] ) {
			$config['smtp'] = array(
				'smtp_host'     => sanitize_text_field( $data['smtp']['smtpHost'] ),
				'smtp_port'     => sanitize_text_field( $data['smtp']['smtpPort'] ),
				'smtp_security' => sanitize_text_field( $data['smtp']['smtpSecurity'] ),
				'smtp_username' => sanitize_text_field( $data['smtp']['smtpUsername'] ),
				'smtp_password' => $data['smtp']['smtpPassword'],
			);
		} elseif ( 'ses' === $config['provider'] ) {
			$config['ses'] = array(
				'access_key_id'     => sanitize_text_field( $data['ses']['accessKeyId'] ),
				'secret_access_key' => $data['ses']['secretAccessKey'],
				'region'            => sanitize_text_field( $data['ses']['region'] ),
			);
		}

		update_option( TRIGGER_EMAIL_CONFIG, $config );

		wp_send_json( $this->success( __( 'Email configuration updated successfully', 'trigger' ) ) );
	}

	/**
	 * Fetch email configuration
	 *
	 * @return void
	 */
	public function fetch_email_config() {
		if ( ! check_ajax_referer( 'trigger_nonce', 'trigger_nonce', false ) ) {
			wp_send_json( $this->error( __( 'Invalid nonce', 'trigger' ) ) );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json( $this->error( __( 'Permission denied', 'trigger' ) ) );
		}

		$config = get_option( TRIGGER_EMAIL_CONFIG, array() );

		wp_send_json( $this->success( __( 'Email configuration fetched successfully', 'trigger' ), $config ) );
	}

	/**
	 * Send test email
	 *
	 * @return void
	 */
	public function send_test_email() {
		if ( ! check_ajax_referer( 'trigger_nonce', 'trigger_nonce', false ) ) {
			wp_send_json( $this->error( __( 'Invalid nonce', 'trigger' ) ) );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json( $this->error( __( 'Permission denied', 'trigger' ) ) );
		}

		$to_email = sanitize_email( $_POST['to_email'] );
		if ( ! is_email( $to_email ) ) {
			wp_send_json( $this->error( __( 'Invalid email address', 'trigger' ) ) );
		}

		$subject = __( 'Test Email from Trigger', 'trigger' );
		$message = __( 'This is a test email sent from Trigger plugin.', 'trigger' );
		$headers = array( 'Content-Type: text/html; charset=UTF-8' );

		$sent = wp_mail( $to_email, $subject, $message, $headers );

		if ( $sent ) {
			wp_send_json( $this->success( __( 'Test email sent successfully', 'trigger' ) ) );
		} else {
			wp_send_json( $this->error( __( 'Failed to send test email', 'trigger' ) ) );
		}
	}
}
