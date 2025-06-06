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
		add_action( 'wp_ajax_delete_email_config', array( $this, 'delete_email_config' ) );
		add_action( 'wp_ajax_get_email_connections', array( $this, 'get_email_connections' ) );
		add_action( 'wp_ajax_get_default_email_connection', array( $this, 'get_default_email_connection' ) );
		add_action( 'wp_ajax_update_default_connection', array( $this, 'update_default_connection' ) );
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
		// $data   = json_decode( $params['data'], true );

		// Get existing config
		$existing_config = get_option( TRIGGER_EMAIL_CONFIG, array() );
		$config          = $existing_config;

		if ( 'smtp' === $params['provider'] ) {
			$config['smtp'] = array(
				'provider'     => sanitize_text_field( $params['provider'] ),
				'fromName'     => sanitize_text_field( $params['fromName'] ),
				'fromEmail'    => sanitize_email( $params['fromEmail'] ),
				'smtpHost'     => sanitize_text_field( $params['smtpHost'] ),
				'smtpPort'     => sanitize_text_field( $params['smtpPort'] ),
				'smtpSecurity' => sanitize_text_field( $params['smtpSecurity'] ),
				'smtpUsername' => sanitize_text_field( $params['smtpUsername'] ),
				'smtpPassword' => sanitize_text_field( $params['smtpPassword'] ),
			);
		} elseif ( 'ses' === $params['provider'] ) {
			$config['ses'] = array(
				'provider'        => sanitize_text_field( $params['provider'] ),
				'fromName'        => sanitize_text_field( $params['fromName'] ),
				'fromEmail'       => sanitize_email( $params['fromEmail'] ),
				'accessKeyId'     => sanitize_text_field( $params['accessKeyId'] ),
				'secretAccessKey' => sanitize_text_field( $params['secretAccessKey'] ),
				'region'          => sanitize_text_field( $params['region'] ),
			);
		} elseif ( 'gmail' === $params['provider'] ) {
			$config['gmail'] = array(
				'provider'     => sanitize_text_field( $params['provider'] ),
				'fromName'     => sanitize_text_field( $params['fromName'] ),
				'fromEmail'    => sanitize_email( $params['fromEmail'] ),
				'clientId'     => sanitize_text_field( $params['clientId'] ),
				'clientSecret' => sanitize_text_field( $params['clientSecret'] ),
			);
		} else {
			return $this->json_response( __( 'Invalid provider', 'trigger' ), null, 400 );
		}

		if ( empty( $existing_config[ $params['provider'] ]['createdAt'] ) ) {
			$config[ $params['provider'] ]['createdAt'] = current_time( 'mysql' );
		}

		update_option( TRIGGER_EMAIL_CONFIG, $config );

		return $this->json_response( __( 'Email configuration updated successfully', 'trigger' ), null, 200 );
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

		// should be delete this commented code later
		// Transform config object into array format
		$connections = array();
		foreach ( $config as $provider => $settings ) {
			$connections[] = $settings;
		}

		return $this->json_response( __( 'Email connections fetched successfully', 'trigger' ), $connections, 200 );
	}

	/**
	 * Get default email connection
	 *
	 * @return  array
	 */
	public function get_default_email_connection() {
		$default_provider = trigger_get_default_provider();
		if ( false === $default_provider ) {
			return $this->json_response( __( 'No default email provider found', 'trigger' ), null, 404 );
		}

		return $this->json_response( 'Fetched default email connection', $default_provider, 200 );
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
		// $params = json_decode( $params['data'], true );

		if ( empty( $params['provider'] ) ) {
			return $this->json_response( __( 'Provider is required', 'trigger' ), null, 400 );
		}

		$default_provider = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );

		if ( empty( $default_provider ) || ! is_array( $default_provider ) ) {
			// todo: add default email provider
			$updated = $this->update_default_provider( $params['provider'] );
			if ( ! $updated ) {
				return $this->json_response( __( 'Failed to update default email provider', 'trigger' ), null, 400 );
			}
		}

		if ( $default_provider['provider'] !== $params['provider'] ) {
			$updated = $this->update_default_provider( $params['provider'] );
			if ( ! $updated ) {
				return $this->json_response( __( 'Failed to update default email provider', 'trigger' ), null, 400 );
			}
		}

		return $this->json_response( __( 'Default email connection updated successfully', 'trigger' ), $params['provider'], 200 );
	}

	/**
	 * Update provider
	 *
	 * @param string $provider Provider name.
	 * @return boolean
	 */
	public function update_default_provider( $provider ) {
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
}
