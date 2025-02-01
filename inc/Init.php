<?php
/**
 * Initialize the plugin
 *
 * @package Trigger\Core
 * @subpackage Trigger\Core\EmailConfiguration
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Trigger\Admin\Init as AdminInit;
use Trigger\Core\Enqueue;
use Trigger\Core\EmailConfiguration;
use Trigger\Frontend\CustomTemplate;
use Trigger\Frontend\RewriteRule;
use Trigger\RestAPI\Routes;

/**
 * The Init class initializes plugin dependencies by creating instances
 * of the classes
 */
class Init {

	/**
	 * Initialize the plugin dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		new Enqueue();
		new AdminInit();
		new Routes();
		new CustomTemplate();
		new EmailConfiguration();
	}
}
