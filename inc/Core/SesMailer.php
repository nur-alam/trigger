<?php
/**
 * AWS SES Mailer Implementation
 *
 * @package Trigger\Core
 * @subpackage Trigger\Core\SesMailer
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Core;

use Aws\Ses\SesClient;
use Aws\Exception\AwsException;
use Trigger\Traits\JsonResponse;

/**
 * Class to send emails via AWS SES
 */
class SesMailer {

	use JsonResponse;

	/**
	 * Send an email using AWS SES
	 *
	 * @param string $to Recipient email address.
	 * @param string $subject Email subject.
	 * @param string $message Email body (HTML).
	 * @param array  $headers Email headers.
	 * @param array  $config AWS SES configuration.
	 *
	 * @return bool|string True on success, error message on failure
	 */
	public function send_email( $to, $subject, $message, $headers = array(), $config = array() ) {
		try {
			// If no config is provided, get from options
			if ( empty( $config ) ) {
				$config = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );
			}

			if ( empty( $config ) || ! isset( $config['accessKeyId'] ) || ! isset( $config['secretAccessKey'] ) ) {
				return $this->json_response( __( 'AWS SES configuration is missing', 'trigger' ), null, 400 );
			}

			// Create SES client
			$ses_client = new SesClient(
				array(
					'version'     => 'latest',
					'region'      => $config['region'] ?? 'us-east-1',
					'credentials' => array(
						'key'    => $config['accessKeyId'],
						'secret' => $config['secretAccessKey'],
					),
				)
			);

			// Format email parameters correctly for AWS SES
			$email_params = array(
				'Source'      => $config['fromEmail'] ?? 'noreply@example.com',
				'Destination' => array(
					'ToAddresses' => is_array( $to ) ? $to : array( $to ), // Convert to array if not already
				),
				'Message'     => array(
					'Subject' => array(
						'Data'    => $subject,
						'Charset' => 'UTF-8',
					),
					'Body'    => array(
						'Html' => array(
							'Data'    => $message,
							'Charset' => 'UTF-8',
						),
						'Text' => array(
							'Data'    => strip_tags( $message ),
							'Charset' => 'UTF-8',
						),
					),
				),
			);

			// Debug output
			// error_log( 'AWS SES Email Params: ' . print_r( $email_params, true ) );

			// Send the email using AWS SES
			$result      = $ses_client->sendEmail( $email_params );
			$msg         = $result->get( 'MessageId' );
			$metadata    = $result->get( '@metadata' );
			$status_code = $metadata['statusCode'];
			if ( $msg && 200 === $status_code ) {
				return true;
			}

			return false;
		} catch ( AwsException $e ) {
			error_log( 'AWS SES Error: ' . $e->getMessage() );

			// Check if this is an email verification error
			if ( strpos( $e->getMessage(), 'Email address is not verified' ) !== false ) {
				return $this->json_response( __( 'Email address is not verified. Please verify your email address before sending emails.', 'trigger' ), null, 400 );
			}
			return $this->json_response( __( 'Failed to send email, please check your email credentials', 'trigger' ), null, 400 );
		}
	}

	/**
	 * Verify an email address with AWS SES
	 *
	 * @param string $email_address Email address to verify.
	 * @param array  $config AWS SES configuration.
	 *
	 * @return array{success: bool, message: string} Result with success status and message
	 */
	public function verify_email_address( $email_address, $config = array() ) {
		if ( empty( $email_address ) || ! is_email( $email_address ) ) {
			return $this->json_response( __( 'Invalid email address', 'trigger' ), null, 400 );
		}

		// If no config is provided, get from options
		if ( empty( $config ) ) {
			$config = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );
		}

		if ( empty( $config ) || ! isset( $config['accessKeyId'] ) || ! isset( $config['secretAccessKey'] ) ) {
			return $this->json_response( __( 'AWS SES configuration is missing', 'trigger' ), null, 400 );
		}

		try {
			// Create SES client
			$ses_client = new SesClient(
				array(
					'version'     => 'latest',
					'region'      => $config['region'] ?? 'us-east-1',
					'credentials' => array(
						'key'    => $config['accessKeyId'],
						'secret' => $config['secretAccessKey'],
					),
				)
			);

			// Send verification email
			$result = $ses_client->verifyEmailIdentity(
				array(
					'EmailAddress' => $email_address,
				)
			);

			$metadata    = $result->get( '@metadata' );
			$status_code = $metadata['statusCode'];
			if ( 200 === $status_code ) {
				return $this->json_response(
					sprintf(
					/* translators: %s: Email address that was verified */
						__( 'Verification email sent to %s. Please check your inbox and follow the instructions to verify your email address.', 'trigger' ),
						$email_address
					),
					null,
					200
				);
			}

			return $this->json_response( __( 'Failed to verify email address', 'trigger' ), null, 400 );
		} catch ( AwsException $e ) {
			return $this->json_response( __( 'Failed to verify email address, please provide valid email address', 'trigger' ), null, 400 );
		}
	}

	/**
	 * Get verified email addresses from AWS SES
	 *
	 * @param array $config AWS SES configuration.
	 *
	 * @return array{success: bool, message: string, data?: array} Result with success status, message and data
	 */
	public function get_verified_emails( $config = array() ) {
		// If no config is provided, get from options
		if ( empty( $config ) ) {
			$config = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );
		}

		if ( empty( $config ) || ! isset( $config['accessKeyId'] ) || ! isset( $config['secretAccessKey'] ) ) {
			return array(
				'success' => false,
				'message' => __( 'AWS SES configuration is missing', 'trigger' ),
			);
		}

		try {
			// Create SES client
			$ses_client = new SesClient(
				array(
					'version'     => 'latest',
					'region'      => $config['region'] ?? 'us-east-1',
					'credentials' => array(
						'key'    => $config['accessKeyId'],
						'secret' => $config['secretAccessKey'],
					),
				)
			);

			// Get list of verified email identities
			$result = $ses_client->listIdentities(
				array(
					'IdentityType' => 'EmailAddress',
				)
			);

			$identities = $result->get( 'Identities' );

			// Get verification status for each identity
			$verified_emails = array();
			if ( ! empty( $identities ) ) {
				$result = $ses_client->getIdentityVerificationAttributes(
					array(
						'Identities' => $identities,
					)
				);

				$attributes = $result->get( 'VerificationAttributes' );
				foreach ( $attributes as $email => $attribute ) {
					$verified_emails[] = array(
						'email'  => $email,
						'status' => $attribute['VerificationStatus'],
					);
				}
			}

			return array(
				'success' => true,
				'message' => __( 'Verified email addresses retrieved successfully', 'trigger' ),
				'data'    => $verified_emails,
			);
		} catch ( AwsException $e ) {
			return array(
				'success' => false,
				'message' => __( 'Failed to retrieve verified email addresses', 'trigger' ),
			);
		}
	}

	/**
	 * Verify SES configuration
	 *
	 * @param array $config AWS SES configuration.
	 *
	 * @return bool|string True on success, error message on failure
	 */
	public function verify_ses_config( $config ) {
		if ( empty( $config ) || ! isset( $config['accessKeyId'] ) || ! isset( $config['secretAccessKey'] ) ) {
			return $this->json_response( __( 'AWS SES configuration is missing', 'trigger' ), null, 400 );
		}

		try {
			$ses_client = new SesClient(
				array(
					'version'     => 'latest',
					'region'      => $config['region'] ?? 'us-east-1',
					'credentials' => array(
						'key'    => $config['accessKeyId'],
						'secret' => $config['secretAccessKey'],
					),
				)
			);

			return true;
		} catch ( AwsException $e ) {
			return $this->json_response( esc_html( $e->getMessage() ), null, 400 );
		}
	}
}
