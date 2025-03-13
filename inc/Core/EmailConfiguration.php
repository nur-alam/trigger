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
	}

	/**
	 * Filter SMTP configuration
	 *
	 * @param PHPMailer\PHPMailer\PHPMailer $phpmailer phpmailer object.
	 *
	 * @return void
	 */
	public function configure_smtp( $phpmailer ) {

		$smtp_settings = get_option( TRIGGER_SMTP_CONFIG, array() );

		// Enable SMTP
		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->isSMTP();
		$phpmailer->Host = $smtp_settings['smtp_host'] ?? '';
		$phpmailer->Port = $smtp_settings['smtp_port'] ?? '587';

		// Set the encryption type (ssl or tls).
		$phpmailer->SMTPSecure = $smtp_settings['smtp_security'] ?? 'TLS';
		$phpmailer->SMTPAuth   = true;

		$phpmailer->Username = $smtp_settings['smtp_username'] ?? '';
		$phpmailer->Password = $smtp_settings['smtp_password'] ?? '';

		// Override the 'From' email address (optional).
		$phpmailer->FromName = $smtp_settings['from_name'] ?? '';
		$phpmailer->From     = $smtp_settings['from_email'] ?? '';
		// phpcs:enable
	}
}
