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
		// add_action( 'wp_ajax_trigger_fetch_smtp_settings', array( $this, 'trigger_fetch_smtp_settings' ) );
		// add_action( 'wp_ajax_trigger_send_test_email', array( $this, 'trigger_send_test_email' ) );
	}

	/**
	 * Dev tools email settings description
	 *
	 * @return  array
	 */
	public function update_smtp_config() {
		sleep( 1 );
		$is_auth = is_user_logged_in();
		if ( ! $is_auth ) {
			$this->response_fail( 'Access denied! Plz login to access this feature.' );
			// $this->send_json_response( 400, '', 'Access denied! Plz login to access this feature.' );
		}
		$params = UtilityHelper::sanitize_array( $_POST ); //phpcs:ignore

		$rules = array(
			'action'        => 'required|string',
			'trigger_nonce' => 'required|string',
			'smtpHost'      => 'required|string',
			'smtpPort'      => 'required|numeric',
			'smtpSecurity'  => 'required|string',
			'smtpUsername'  => 'required|string',
			'smtpPassword'  => 'required|string',
			'fromName'      => 'required|string',
			'fromEmail'     => 'required|string|email',
		);

		$validator = ValidationHelper::validate( $rules, $params );
		if ( ! $validator->success ) {
			return $this->json_response( 'Validation failed!', array( 'errors', $validator->errors ), 400 );
		}

		$plugin_info = Trigger::plugin_data();
		if ( ! isset( $_POST['trigger_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['trigger_nonce'] ) ), $plugin_info['nonce_action'] ) ) {
			return $this->json_response( 'Nonce verification failed!', null, 400 );
		}
		try {
			$this->update( $params );
			$this->json_response( 'Email settings saved!' );
		} catch ( \Throwable $th ) {
			return $this->json_response( $th->getMessage(), null, 400 );
		}
	}

	/**
	 * Update settings
	 *
	 * @param  array $data  settings data.
	 */
	public function update( $data ) {
		return update_option( TRIGGER_SMTP_CONFIG, $data );
	}
}
