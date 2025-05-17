<?php
/**
 * Google Mail Implementation
 *
 * @package Trigger\Core
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Controllers\Provider;

use Trigger\Controllers\Provider\aws\AwsSesController;
use Trigger\Controllers\Provider\gmail\GmailController;

/**
 * InitProvider class
 */
class InitProvider {

	/**
	 * Constructor
	 */
	public function __construct() {
		new AwsSesController();
		new GmailController();
	}
}
