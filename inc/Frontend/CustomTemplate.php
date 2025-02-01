<?php
/**
 * Initialize the plugin
 *
 * @package Trigger\Core
 * @subpackage Trigger\Core\EmailConfiguration
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Frontend;

use Trigger\Frontend\ShortCodes\InitShortCodes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * CustomTemplate description
 */
class CustomTemplate {

	/**
	 * Register hooks
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		new InitShortCodes();
	}
}
