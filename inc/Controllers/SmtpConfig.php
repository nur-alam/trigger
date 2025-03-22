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

use Trigger\Helpers\ValidationHelper;
use Trigger\Traits\JsonResponse;
use Trigger\Core\SesMailer;
use Exception;

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
		add_action( 'wp_ajax_trigger_send_test_email', array( $this, 'send_test_email' ) );
		add_action( 'wp_ajax_delete_email_config', array( $this, 'delete_email_config' ) );
		add_action( 'wp_ajax_get_email_connections', array( $this, 'get_email_connections' ) );
		add_action( 'wp_ajax_edit_email_config', array( $this, 'edit_email_config' ) );
		add_action( 'wp_ajax_verify_ses_email', array( $this, 'verify_ses_email' ) );
		add_action( 'wp_ajax_get_verified_ses_emails', array( $this, 'get_verified_ses_emails' ) );
		add_action( 'wp_ajax_get_default_email_connection', array( $this, 'get_default_email_connection' ) );
		add_action( 'wp_ajax_update_default_connection', array( $this, 'update_default_connection' ) );
		add_action( 'wp_ajax_get_log_retention', array( $this, 'get_log_retention' ) );
		add_action( 'wp_ajax_update_log_retention', array( $this, 'update_log_retention' ) );
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
				'provider'     => sanitize_text_field( $data['provider'] ),
				'fromName'     => sanitize_text_field( $data['fromName'] ),
				'fromEmail'    => sanitize_email( $data['fromEmail'] ),
				'smtpHost'     => sanitize_text_field( $data['smtpHost'] ),
				'smtpPort'     => sanitize_text_field( $data['smtpPort'] ),
				'smtpSecurity' => sanitize_text_field( $data['smtpSecurity'] ),
				'smtpUsername' => sanitize_text_field( $data['smtpUsername'] ),
				'smtpPassword' => sanitize_text_field( $data['smtpPassword'] ),
			);
		} elseif ( 'ses' === $data['provider'] ) {
			$config['ses'] = array(
				'provider'        => sanitize_text_field( $data['provider'] ),
				'fromName'        => sanitize_text_field( $data['fromName'] ),
				'fromEmail'       => sanitize_email( $data['fromEmail'] ),
				'accessKeyId'     => sanitize_text_field( $data['accessKeyId'] ),
				'secretAccessKey' => sanitize_text_field( $data['secretAccessKey'] ),
				'region'          => sanitize_text_field( $data['region'] ),
			);
		} else {
			return $this->json_response( __( 'Invalid provider', 'trigger' ), null, 400 );
		}

		$config[ $data['provider'] ]['createdAt'] = current_time( 'mysql' );

		update_option( TRIGGER_EMAIL_CONFIG, $config );

		return $this->json_response( __( 'Email configuration updated successfully', 'trigger' ), null, 200 );
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
	 * Delete email configuration
	 *
	 * @return object
	 */
	public function delete_email_config() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		if ( empty( $params['provider'] ) ) {
			return $this->json_response( __( 'Provider is required', 'trigger' ), null, 400 );
		}

		$provider              = sanitize_text_field( $params['provider'] );
		$existing_email_config = get_option( TRIGGER_EMAIL_CONFIG, array() );

		if ( empty( $existing_email_config ) || ! isset( $existing_email_config[ $provider ] ) ) {
			return $this->json_response( __( 'Configuration not found', 'trigger' ), null, 404 );
		}

		// Remove the specified provider from config
		unset( $existing_email_config[ $provider ] );
		update_option( TRIGGER_EMAIL_CONFIG, $existing_email_config );

		// Return the updated connections list in array format
		$connections  = array();
		$email_config = get_option( TRIGGER_EMAIL_CONFIG, array() );
		foreach ( $email_config as $provider_key => $config ) {
			$connections[] = $config;
		}
		sleep( 1 );
		return $this->json_response( __( 'Email configuration deleted successfully', 'trigger' ), $connections, 200 );
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

	/**
	 * Edit email configuration
	 *
	 * @return object
	 */
	public function edit_email_config() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params            = $verify['data'];
		$data              = json_decode( $params['data'], true );
		$data['createdAt'] = current_time( 'mysql' );

		if ( empty( $data['provider'] ) ) {
			return $this->json_response( __( 'Provider is required', 'trigger' ), null, 400 );
		}

		$existing_email_config                      = get_option( TRIGGER_EMAIL_CONFIG, array() );
		$existing_email_config[ $data['provider'] ] = $data;
		$update_option                              = update_option( TRIGGER_EMAIL_CONFIG, $existing_email_config );

		if ( ! $update_option ) {
			return $this->json_response( __( 'Failed to update email configuration', 'trigger' ), null, 400 );
		}

		return $this->json_response( __( 'Email configuration updated successfully', 'trigger' ), $update_option, 200 );
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

	/**
	 * Get default email connection
	 *
	 * @return  array
	 */
	public function get_default_email_connection() {
		$default_provider = $this->get_default_provider();
		if ( false === $default_provider ) {
			return $this->json_response( __( 'No default email provider found', 'trigger' ), null, 404 );
		}

		return $this->json_response( 'Fetched default email connection', $default_provider, 200 );
	}

	/**
	 * Get default email connection
	 *
	 * @return  array|boolean
	 */
	public function get_default_provider() {
		$default_provider = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );

		if ( empty( $default_provider ) ) {
			return false;
		}

		return $default_provider;
	}

	/**
	 * Update default email connection
	 *
	 * @return object
	 */
	public function update_default_connection() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$data   = json_decode( $params['data'], true );

		if ( empty( $data['provider'] ) ) {
			return $this->json_response( __( 'Provider is required', 'trigger' ), null, 400 );
		}

		$default_provider = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );

		if ( empty( $default_provider ) || ! is_array( $default_provider ) ) {
			// todo: add default email provider
			$updated = $this->update_provider( $data['provider'] );
			if ( ! $updated ) {
				return $this->json_response( __( 'Failed to update default email provider', 'trigger' ), null, 400 );
			}
		}

		if ( $default_provider['provider'] !== $data['provider'] ) {
			$updated = $this->update_provider( $data['provider'] );
			if ( ! $updated ) {
				return $this->json_response( __( 'Failed to update default email provider', 'trigger' ), null, 400 );
			}
		}

		return $this->json_response( __( 'Default email connection updated successfully', 'trigger' ), $data['provider'], 200 );
	}

	/**
	 * Update provider
	 *
	 * @param string $provider Provider name.
	 * @return boolean
	 */
	public function update_provider( $provider ) {
		$providers = get_option( TRIGGER_EMAIL_CONFIG, array() );

		if ( empty( $providers ) ) {
			return false;
		}

		$default_provider = $providers[ $provider ];
		$updated          = update_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, $default_provider );

		if ( ! $updated ) {
			return false;
		}

		return true;
	}

	/**
	 * Get log retention
	 *
	 * @return object
	 */
	public function get_log_retention() {
		$log_retention = get_option( TRIGGER_LOG_RETENTION, TRIGGER_LOG_RETENTION_DEFAULT );

		if ( empty( $log_retention ) ) {
			$log_retention = TRIGGER_LOG_RETENTION_DEFAULT;
		}

		return $this->json_response( __( 'Log retention fetched successfully', 'trigger' ), $log_retention, 200 );
	}

	/**
	 * Update log retention
	 *
	 * @return object
	 */
	public function update_log_retention() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$data   = json_decode( $params['data'], true );

		$updated = update_option( TRIGGER_LOG_RETENTION, $data['days'] );

		if ( ! $updated ) {
			return $this->json_response( __( 'Failed to update log retention', 'trigger' ), null, 400 );
		}

		return $this->json_response( __( 'Log retention updated successfully', 'trigger' ), $data['days'], 200 );
	}
}
