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
