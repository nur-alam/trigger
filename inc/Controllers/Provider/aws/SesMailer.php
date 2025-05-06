<?php
/**
 * AWS SES Mailer Implementation
 *
 * @package Trigger\Core
 * @subpackage Trigger\Core\SesMailer
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Controllers\Provider\aws;

use Aws\Ses\SesClient;
use Aws\Exception\AwsException;
use Trigger\Traits\JsonResponse;
use Exception;

/**
 * Class to send emails via AWS SES
 */
class SesMailer {

	use JsonResponse;

	/**
	 * AWS SES credentials
	 *
	 * @var string
	 */
	private $access_key;

	/**
	 * AWS SES credentials
	 *
	 * @var string
	 */
	private $secret_key;

	/**
	 * AWS SES region
	 *
	 * @var string
	 */
	public $region;

	/**
	 * AWS SES service
	 *
	 * @var string
	 */
	private $service = 'ses';

	/**
	 * AWS SES host
	 *
	 * @var string
	 */
	public $host;

	/**
	 * AWS SES endpoint
	 *
	 * @var string
	 */
	public $endpoint;

	/**
	 * AWS SES provider config
	 *
	 * @var array
	 */
	public $provider_config = array();

	/**
	 * Constructor
	 */
	public function __construct() {
		$config = get_option( TRIGGER_EMAIL_CONFIG, array() );

		if ( ! empty( $config ) ) {
			$this->provider_config = $config['ses'];
		}

		// if ( empty( $config ) || ! isset( $config['accessKeyId'] ) || ! isset( $config['secretAccessKey'] ) ) {
		// return $this->json_response( __( 'AWS SES configuration is missing', 'trigger' ), null, 400 );
		// }

		$this->access_key = $this->provider_config['accessKeyId'] ?? '';
		$this->secret_key = $this->provider_config['secretAccessKey'] ?? '';
		$this->region     = $this->provider_config['region'] ?? 'us-east-1';
		$this->host       = 'email.' . $this->provider_config['region'] . '.amazonaws.com';
		$this->endpoint   = "https://{$this->host}";
	}

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
	public function send_email( $to, $subject, $message, $headers = array(), $config = array(), $is_html = false ) {
		try {
			// If no config is provided, get from options
			if ( empty( $this->provider_config ) ) {
				$this->provider_config = get_option( TRIGGER_EMAIL_CONFIG, array() )['ses'] ?? array();
			}

			// if ( empty( $provider_config ) || ! isset( $provider_config['accessKeyId'] ) || ! isset( $provider_config['secretAccessKey'] ) ) {
			// return $this->json_response( __( 'AWS SES configuration is missing', 'trigger' ), null, 400 );
			// }

			$message_body_format = 'Message.Body.Html.Data';
			if ( $is_html ) {
				$message_body_format = 'Message.Body.Html.Data';
			} else {
				$message_body_format = 'Message.Body.Text.Data';
			}

			if ( is_array( $to ) ) {
				$to = $to[0];
			}

			$params = array(
				'Action'                           => 'SendEmail',
				'Source'                           => $this->provider_config['fromEmail'] ?? '',
				'Destination.ToAddresses.member.1' => $to,
				'Message.Subject.Data'             => $subject,
				$message_body_format               => $message,
				'Version'                          => '2010-12-01',
			);

			$body = $this->make_request( $params );

			if ( strpos( $body, '<SendEmailResult' ) !== false ) {
				return true;
			}

			return false;
		} catch ( AwsException $e ) {
			// error_log( 'AWS SES Error: ' . $e->getMessage() );
			// Check if this is an email verification error
			// if ( strpos( $e->getMessage(), 'Email address is not verified' ) !== false ) {
			// return throw new Exception(__('Email address is not verified. Please verify your email address before sending emails.', 'trigger'), 400);
			// return $this->json_response( __( 'Email address is not verified. Please verify your email address before sending emails.', 'trigger' ), null, 400 );
			return false;
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
		try {
			$params = array(
				'Action'       => 'VerifyEmailIdentity',
				'EmailAddress' => $email_address,
				'Version'      => '2010-12-01',
			);

			$body = $this->make_request( $params );

			if ( strpos( $body, '<VerifyEmailIdentityResult' ) !== false ) {
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
		// if no config is provided, get from options
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

			$params = array(
				'Action'       => 'ListIdentities',
				'IdentityType' => 'EmailAddress',
				'MaxItems'     => '100',
				'Version'      => '2010-12-01',

			);

			$body = $this->make_request( $params );

			if ( isset( $body['error'] ) ) {
				return array(
					'success' => false,
					'message' => __( 'Failed to retrieve verified email addresses', 'trigger' ),
				);
			}

			// Parse XML response to get email addresses
			$xml             = simplexml_load_string( $body );
			$verified_emails = array();

			if ( $xml && isset( $xml->ListIdentitiesResult->Identities->member ) ) {
				// Get list of emails first
				$emails = array();
				foreach ( $xml->ListIdentitiesResult->Identities->member as $email ) {
					$emails[] = (string) $email;
				}

				// Now get verification status for these emails
				$params = array(
					'Action'  => 'GetIdentityVerificationAttributes',
					'Version' => '2010-12-01',
				);

				// Add emails to parameters
				foreach ( $emails as $index => $email ) {
					$params[ 'Identities.member.' . ( $index + 1 ) ] = $email;
				}

				$verification_response = $this->make_request( $params );
				$verification_xml      = simplexml_load_string( $verification_response );

				if ( $verification_xml && isset( $verification_xml->GetIdentityVerificationAttributesResult->VerificationAttributes ) ) {
					foreach ( $verification_xml->GetIdentityVerificationAttributesResult->VerificationAttributes->entry as $entry ) {
						$email  = (string) $entry->key;
						$status = (string) $entry->value->VerificationStatus;

						$verified_emails[] = array(
							'email'  => $email,
							'status' => $status,
						);
					}
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
	 * Calculate AWS signature for request authentication
	 *
	 * @param string $date_stamp The date stamp in YYYYMMDD format.
	 * @param string $string_to_sign The string to be signed.
	 * @return string The calculated signature.
	 */
	private function get_signature( $date_stamp, $string_to_sign ) {
		$secret_key = 'AWS4' . $this->secret_key;
		$date       = hash_hmac( 'sha256', $date_stamp, $secret_key, true );
		$region     = hash_hmac( 'sha256', $this->region, $date, true );
		$service    = hash_hmac( 'sha256', $this->service, $region, true );
		$signing    = hash_hmac( 'sha256', 'aws4_request', $service, true );
		return hash_hmac( 'sha256', $string_to_sign, $signing );
	}

	/**
	 * Make a request to AWS SES API
	 *
	 * @param array $params The request parameters.
	 * @return mixed The response from the API.
	 */
	private function make_request( $params ) {
		$query_string = http_build_query( $params, '', '&', PHP_QUERY_RFC3986 );
		$amz_date     = gmdate( 'Ymd\THis\Z' );
		$date_stamp   = gmdate( 'Ymd' );
		$payload_hash = hash( 'sha256', $query_string );

		$canonical_request = implode(
			"\n",
			array(
				'POST',
				'/',
				'',
				"content-type:application/x-www-form-urlencoded\nhost:{$this->host}\nx-amz-date:$amz_date\n",
				'content-type;host;x-amz-date',
				$payload_hash,
			)
		);

		$credential_scope = "$date_stamp/{$this->region}/{$this->service}/aws4_request";
		$string_to_sign   = implode(
			"\n",
			array(
				'AWS4-HMAC-SHA256',
				$amz_date,
				$credential_scope,
				hash( 'sha256', $canonical_request ),
			)
		);

		$signature            = $this->get_signature( $date_stamp, $string_to_sign );
		$authorization_header = "AWS4-HMAC-SHA256 Credential={$this->access_key}/$credential_scope, SignedHeaders=content-type;host;x-amz-date, Signature=$signature";

		$headers = array(
			'Content-Type'  => 'application/x-www-form-urlencoded',
			'X-Amz-Date'    => $amz_date,
			'Authorization' => $authorization_header,
		);

		$response = wp_remote_post(
			$this->endpoint,
			array(
				'headers' => $headers,
				'body'    => $query_string,
			)
		);

		if ( is_wp_error( $response ) ) {
			return array( 'error' => $response->get_error_message() );
		}

		return wp_remote_retrieve_body( $response );
	}
}
