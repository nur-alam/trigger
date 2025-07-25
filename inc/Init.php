<?php
/**
 * Initialize the plugin
 *
 * @package Trigger\Core
 * @subpackage Trigger\Init
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Trigger\Admin\Init as AdminInit;
use Trigger\Controllers\SmtpConfig;
use Trigger\Core\Enqueue;
use Trigger\Core\EmailConfiguration;
use Trigger\Controllers\EmailLogController;
use Trigger\Controllers\Provider\InitProvider;
use Trigger\Frontend\CustomTemplate;
use Trigger\RestAPI\Routes;
use Trigger\Services\EmailBuilder\EmailBuilderInit;

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
		new SmtpConfig();
		new EmailLogController();
		new InitProvider();
	}
}
