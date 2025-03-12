<?php
/**
 * Global constants
 *
 * @package Trigger
 * @subpackage Trigger\Globals
 * @since 1.0.0
 */

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
 * Nonce checking.
 *
 * @param   string $nonce_key      $nonce_key nonce key.
 * @param   string $nonce_value    $nonce_value nonce value.
 * @return  boolean
 */
// function trigger_verify_nonce( $nonce_key, $nonce_value ) {
// return true;
// }
