<?php
/**
 * Global constants
 *
 * @package Trigger
 * @subpackage Trigger\Globals
 * @since 1.0.0
 */

use Trigger\Helpers\UtilityHelper;

/**
 * Authentication checking.
 *
 * @return  boolean
 */
function trigger_auth_check() {
	if ( ! is_user_logged_in() ) {
		return false;
	}
	return true;
}

/**
 * Verify nonce and authentication.
 *
 * @param string $nonce_key The nonce key from POST/GET request.
 * @param string $action The nonce action to verify against.
 * @param bool   $check_auth Whether to check user authentication (default: true).
 * @return array{success: bool, message: string, code: int, data?: array} Returns array with verification result and sanitized data.
 */
function trigger_verify_request( $nonce_key = 'trigger_nonce', $action = '', $check_auth = true ) {
	// Check authentication if required
	if ( $check_auth && ! is_user_logged_in() ) {
		return array(
			'success' => false,
			'message' => 'Access denied! Please login to access this feature.',
			'code'    => 403,
		);
	}

	// Get the nonce action
	if ( empty( $action ) ) {
		$plugin_info = Trigger::plugin_data();
		$action      = $plugin_info['nonce_action'];
	}

	// Verify nonce
	if ( ! isset( $_REQUEST[ $nonce_key ] ) || ! wp_verify_nonce(
		sanitize_text_field( wp_unslash( $_REQUEST[ $nonce_key ] ) ),
		$action
	) ) {
		return array(
			'success' => false,
			'message' => 'Invalid security token! Please refresh the page and try again.',
			'code'    => 400,
		);
	}

	// Return success with sanitized POST data
	return array(
		'success' => true,
		'message' => 'Verification successful.',
		'code'    => 200,
		'data'    => UtilityHelper::sanitize_array( $_POST ),
	);
}

/**
 * Nonce checking.
 *
 * @param   string $nonce_key      $nonce_key nonce key.
 * @param   string $nonce_value    $nonce_value nonce value.
 * @return  boolean
 */
// function trigger_verify_nonce( $nonce_key, $nonce_value ) {
// return true;
// }
