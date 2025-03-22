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

		$this->set_default_email_provider();

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

		$this->configure_smtp( $phpmailer );
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
	 * Set default email provider
	 *
	 * @return void
	 */
	private function set_default_email_provider() {
		$email_providers = get_option( TRIGGER_EMAIL_CONFIG, array() );
		if ( empty( $email_providers ) ) {
			return;
		}

		$this->config = $email_providers['smtp'];
		// $this->config = $email_providers['ses'];
		update_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, $this->config );
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
		try {
			// Create an AWS SES client
			$ses_client = new SesClient(
				array(
					'version'     => 'latest',
					'region'      => $provider['region'] ?? 'us-east-1',
					'credentials' => array(
						'key'    => $provider['accessKeyId'] ?? '',
						'secret' => $provider['secretAccessKey'] ?? '',
					),
				)
			);

			// Get credentials to use in PHPMailer
			// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			$phpmailer->isSMTP();
			$phpmailer->Host       = 'email-smtp.' . $provider['region'] ?? 'us-east-1.amazonaws.com';
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
