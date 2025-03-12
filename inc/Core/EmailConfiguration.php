<?php
/**
 * Email configuration class
 *
 * @package Trigger\Core
 * @subpackage Trigger\Core\EmailConfiguration
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Core;

use Trigger\Traits\JsonResponse;

/**
 * Email configuration class
 */
class EmailConfiguration {

	/**
	 * Register hooks
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'phpmailer_init', array( $this, 'configure_smtp' ) );
		add_action( 'wp_ajax_trigger_send_test_mail', array( $this, 'send_test_mail' ) );
	}

	/**
	 * Filter SMTP configuration
	 *
	 * @param PHPMailer\PHPMailer\PHPMailer $phpmailer phpmailer object.
	 *
	 * @return void
	 */
	public function configure_smtp( $phpmailer ) {
		// Enable SMTP
		$phpmailer->isSMTP();
		$phpmailer->Host = '';
		$phpmailer->Port = 587;

		// Set the encryption type (ssl or tls).
		$phpmailer->SMTPSecure = 'TLS';
		$phpmailer->SMTPAuth   = true;

		$phpmailer->Username = ( '' );
		$phpmailer->Password = ( '' );

		/**
		 * For debug
		 * $phpmailer->SMTPDebug = 2;
		 */
		// Override the 'From' email address (optional).
		$phpmailer->FromName = ( '' );
		$phpmailer->From     = ( '' );
	}
}
