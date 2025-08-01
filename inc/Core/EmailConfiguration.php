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

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
/**
 * Email configuration class
 */
class EmailConfiguration {
	/**
	 * Email configuration settings
	 *
	 * @var array
	 */
	private $config;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->config = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );
		add_action( 'phpmailer_init', array( $this, 'configure_email' ), 10, 1 );
		add_action( 'trigger_phpmailer_init', array( $this, 'config_smtp_for_test_mail' ), 10, 1 );
	}

	/**
	 * Configure email settings
	 *
	 * @param PHPMailer $phpmailer PHPMailer instance.
	 * @return void
	 */
	public function configure_email( PHPMailer $phpmailer ) {
		$default_provider = trigger_get_default_provider();
		if ( 'smtp' === $default_provider['provider'] ) {
			if ( empty( $this->config ) ) {
				return;
			}

			$provider   = $this->config['provider'] ?? 'smtp';
			$from_name  = $this->config['fromName'] ?? '';
			$from_email = $this->config['fromEmail'] ?? '';

			if ( '' !== $from_name ) {
				// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				$phpmailer->FromName = $from_name;
				// phpcs:enable
			}
			if ( '' !== $from_email ) {
				// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				$phpmailer->From = $from_email;
				// phpcs:enable
			}

			// $this->configure_ses( $phpmailer );
			$this->configure_smtp( $phpmailer );
		}
	}

	/**
	 * Configure SMTP settings
	 *
	 * @param PHPMailer $phpmailer PHPMailer instance.
	 * @return void
	 */
	private function configure_smtp( PHPMailer $phpmailer ) {
		$provider = $this->config ?? array();

		if ( empty( $provider ) ) {
			return;
		}

		$phpmailer->isSMTP();
		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->Host       = $provider['smtpHost'] ?? '';
		$phpmailer->Port       = $provider['smtpPort'] ?? '';
		$phpmailer->SMTPSecure = $provider['smtpSecurity'] ?? 'ssl';
		$phpmailer->SMTPAuth   = true;
		$phpmailer->Username   = $provider['smtpUsername'];
		$phpmailer->Password   = $provider['smtpPassword'];
		// phpcs:enable
	}

	/**
	 * Configure Amazon SES settings
	 *
	 * @param PHPMailer $phpmailer PHPMailer instance.
	 * @return void
	 * @throws Exception If there's an error configuring SES.
	 */
	public function config_smtp_for_test_mail( PHPMailer $phpmailer ) {
		$provider = trigger_get_provider( 'smtp' );
		if ( empty( $provider ) ) {
			return;
		}

		$from_name  = $provider['fromName'] ?? '';
		$from_email = $provider['fromEmail'] ?? '';

		if ( '' !== $from_name ) {
			// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			$phpmailer->FromName = $from_name;
			// phpcs:enable
		}
		if ( '' !== $from_email ) {
			// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			$phpmailer->From = $from_email;
			// phpcs:enable
		}

		$phpmailer->isSMTP();
		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->Host       = $provider['smtpHost'] ?? '';
		$phpmailer->Port       = $provider['smtpPort'] ?? '';
		$phpmailer->SMTPSecure = $provider['smtpSecurity'] ?? 'ssl';
		$phpmailer->SMTPAuth   = true;
		$phpmailer->Username   = $provider['smtpUsername'];
		$phpmailer->Password   = $provider['smtpPassword'];
		// phpcs:enable
	}
}
