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

if ( ! defined( 'TRIGGER_EMAIL_CONFIG' ) ) {
	define( 'TRIGGER_EMAIL_CONFIG', 'trigger_email_config' );
}

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
		add_action( 'phpmailer_init', array( $this, 'configure_email' ), 10, 1 );
		$this->config = get_option( TRIGGER_EMAIL_CONFIG, array() );
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
		$from_name  = $this->config['from_name'] ?? '';
		$from_email = $this->config['from_email'] ?? '';

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

		if ( 'smtp' === $provider ) {
			$this->configure_smtp( $phpmailer );
		} elseif ( 'ses' === $provider ) {
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
		$smtp = $this->config['smtp'] ?? array();

		if ( empty( $smtp ) ) {
			return;
		}

		$phpmailer->isSMTP();
		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->Host       = $smtp['smtp_host'] ?? '';
		$phpmailer->Port       = $smtp['smtp_port'] ?? '';
		$phpmailer->SMTPSecure = $smtp['smtp_security'] ?? 'ssl';

		if ( ! empty( $smtp['smtp_username'] ) && ! empty( $smtp['smtp_password'] ) ) {
			$phpmailer->SMTPAuth = true;
			$phpmailer->Username = $smtp['smtp_username'];
			$phpmailer->Password = $smtp['smtp_password'];
		}
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
		$smtp = $this->config['ses'] ?? array();

		if ( empty( $smtp ) ) {
			return;
		}
		try {
			$client = new SesClient(
				array(
					'version'     => 'latest',
					'region'      => $smtp['region'] ?? 'us-east-1',
					'credentials' => array(
						'key'    => $smtp['access_key_id'] ?? '',
						'secret' => $smtp['secret_access_key'] ?? '',
					),
				)
			);

			// Override PHPMailer's send() function with our SES implementation
			// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			$phpmailer->custom_send = function ( $phpmailer ) use ( $client ) {
				$to = array();
				foreach ( $phpmailer->getToAddresses() as $address ) {
					$to[] = $address[0];
				}

				$cc = array();
				foreach ( $phpmailer->getCcAddresses() as $address ) {
					$cc[] = $address[0];
				}

				$bcc = array();
				foreach ( $phpmailer->getBccAddresses() as $address ) {
					$bcc[] = $address[0];
				}

				try {
					$result = $client->sendEmail(
						array(
							'Source'      => $phpmailer->From,
							'Destination' => array(
								'ToAddresses'  => $to,
								'CcAddresses'  => $cc,
								'BccAddresses' => $bcc,
							),
							'Message'     => array(
								'Subject' => array(
									'Data'    => $phpmailer->Subject,
									'Charset' => $phpmailer->CharSet,
								),
								'Body'    => array(
									'Html' => array(
										'Data'    => $phpmailer->Body,
										'Charset' => $phpmailer->CharSet,
									),
									'Text' => array(
										'Data'    => $phpmailer->AltBody ?: strip_tags( $phpmailer->Body ),
										'Charset' => $phpmailer->CharSet,
									),
								),
							),
						)
					);

					return true;
				} catch ( AwsException $e ) {
					throw new Exception( $e->getMessage() );
				}
			};
			// phpcs:enable
		} catch ( AwsException $e ) {
			throw new Exception( $e->getMessage() );
		}
	}
}
