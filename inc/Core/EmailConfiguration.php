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
use Aws\Ses\SesClient;
use Aws\Exception\AwsException;
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
	}

	/**
	 * Configure email settings
	 *
	 * @param PHPMailer $phpmailer PHPMailer instance.
	 * @return void
	 */
	public function configure_email( PHPMailer $phpmailer ) {
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

		$default_provider = get_default_provider();

		// $this->configure_ses( $phpmailer );

		if ( 'smtp' === $default_provider['provider'] ) {
			$this->configure_smtp( $phpmailer );
		} elseif ( 'ses' === $default_provider['provider'] ) {
			$this->configure_ses( $phpmailer );
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
	private function configure_ses( PHPMailer $phpmailer ) {
		$provider = $this->config ?? array();

		if ( empty( $provider ) ) {
			return;
		}
		// $host = 'email-smtp.' . $provider['region'] ?? 'us-east-1.amazonaws.com';
		$host = 'email-smtp.us-east-1.amazonaws.com';
		try {
			// Get credentials to use in PHPMailer
			// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			$phpmailer->isSMTP();
			$phpmailer->Host       = $host;
			$phpmailer->SMTPAuth   = true;
			$phpmailer->Username   = $provider['accessKeyId'] ?? '';
			$phpmailer->Password   = $provider['secretAccessKey'] ?? '';
			$phpmailer->SMTPSecure = 'tls';
			$phpmailer->Port       = 587;
			// phpcs:enable
			$phpmailer->setFrom( $provider['fromEmail'] ?? '', $provider['fromName'] ?? '' );

		} catch ( AwsException $e ) {
			throw new Exception( esc_html( $e->getMessage() ) );
		}
	}
}
