<?php
/**
 * Google Mail Implementation
 *
 * @package Trigger\Core
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Controllers\Provider\gmail;

use Trigger\Traits\JsonResponse;

/**
 * GoogleMailer class
 */
class GMailer {

	use JsonResponse;


	/**
	 * $client_id OF Gmail
	 *
	 * @var string
	 */
	private $client_id = '';

	/**
	 * $client_secret OF Gmail
	 *
	 * @var string
	 */
	private $client_secret = '';

	/**
	 * $gmail_access_token
	 *
	 * @var string
	 */
	private $gmail_access_token = '';

	/**
	 * $google_credentials OF Gmail
	 *
	 * @var string
	 */
	private $gmail_credentials = '';

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->gmail_credentials = get_option( GMAIL_AUTH_CREDENTIALS );
		if ( $this->gmail_credentials ) {
			if ( ! empty( $this->gmail_credentials ) ) {
				$this->gmail_access_token = $this->gmail_credentials['access_token'];
			}
		}
		$provider = trigger_get_provider( 'gmail' );
		if ( ! empty( $provider ) && $provider['clientId'] && $provider['clientSecret'] ) {
			$this->client_id     = $provider['clientId'];
			$this->client_secret = $provider['clientSecret'];
		}
	}

	/**
	 * Send email using Gmail API
	 *
	 * @param array $data Email data.
	 *
	 * @return bool|string True on success, error message on failure.
	 */
	public function send_email( $data ) {
		$to      = $data['sendTo'];
		$subject = 'Test Email from Gmail API';
		$body    = "Hello!\nThis email was sent using Gmail API (no composer) from a WordPress plugin.";

		$raw_message  = "From: me\r\n";
		$raw_message .= "To: $to\r\n";
		$raw_message .= "Subject: $subject\r\n";
		$raw_message .= "MIME-Version: 1.0\r\n";
		$raw_message .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
		$raw_message .= $body;

		$base64 = rtrim( strtr( base64_encode( $raw_message ), '+/', '-_' ), '=' );

		$this->gmail_refresh_token_if_needed( $this->gmail_credentials );

		$response = wp_remote_post(
			'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
			array(
				'headers' => array(
					'Authorization' => 'Bearer ' . $this->gmail_access_token,
					'Content-Type'  => 'application/json',
				),
				'body'    => json_encode( array( 'raw' => $base64 ) ),
				'method'  => 'POST',
				'timeout' => 15,
			)
		);

		$response_body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( is_wp_error( $response ) ) {
			return false;
		}

		if ( ! empty( $response_body['id'] ) ) {
			return true;
		}

		return false;
	}


	/**
	 * Page content for the Gmail Mailer Manual page
	 */
	public function gmail_authentication() {
		$gmail_credentials = get_option( GMAIL_AUTH_CREDENTIALS );

		// Refresh token if expired
		if ( $gmail_credentials && isset( $gmail_credentials['refresh_token'] ) ) {
			$gmail_credentials = $this->gmail_refresh_token_if_needed( $gmail_credentials );
		}

		if ( ! $gmail_credentials ) {
			$auth_url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query(
				array(
					'client_id'     => $this->client_id,
					'redirect_uri'  => TRIGGER_REDIRECT_URI,
					'response_type' => 'code',
					'scope'         => 'https://www.googleapis.com/auth/gmail.send',
					'access_type'   => 'offline',
					'prompt'        => 'consent',
				)
			);
			return $this->json_response(
				'Gmail is connected!',
				array(
					'auth_url' => $auth_url,
				),
				200
			);
		}
		return $this->json_response(
			'Gmail is already connected',
			array(
				'auth_url' => '',
			),
			200,
		);
	}


	/**
	 * Page content for the Gmail Mailer Manual page
	 */
	public function gmail_re_authentication() {
		try {
			$auth_url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query(
				array(
					// 'client_id'     => 'sadf737022802575-th58sa7cfl265udpaeotj3omn8nnrpaa.apps.googleusercontent.com',
					// 'redirect_uri'  => 'localhost:8000/wp-admin/admin.php?page=trigger',
					'client_id'     => $this->client_id,
					'redirect_uri'  => TRIGGER_REDIRECT_URI,
					'response_type' => 'code',
					'scope'         => 'https://www.googleapis.com/auth/gmail.send',
					'access_type'   => 'offline',
					'prompt'        => 'consent',
				)
			);
			wp_safe_redirect( $auth_url );
			die();
		} catch ( \Throwable $th ) {
			$this->json_response(
				'Gmail connection failed!!, check your credentials',
				array(),
				400,
			);
		}
	}

	/**
	 * Refresh token if needed
	 *
	 * @param array $gmail_credentials Gmail credentials.
	 *
	 * @return string
	 */
	public function gmail_refresh_token_if_needed( $gmail_credentials ) {
		$expires_at = $gmail_credentials['created'] + $gmail_credentials['expires_in'] - 60; // refresh 1 min early
		if ( time() < $expires_at ) {
			return $gmail_credentials; // still valid
		}

		if ( empty( $gmail_credentials['refresh_token'] ) ) {
			return false;
		}

		$response = wp_remote_post(
			'https://oauth2.googleapis.com/token',
			array(
				'body' => array(
					'client_id'     => $this->client_id,
					'client_secret' => $this->client_secret,
					'refresh_token' => $gmail_credentials['refresh_token'],
					'grant_type'    => 'refresh_token',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( ! isset( $body['access_token'] ) ) {
			return false;
		}

		// Update token data
		$new_token = array(
			'access_token'  => $body['access_token'],
			'expires_in'    => $body['expires_in'],
			'refresh_token' => $gmail_credentials['refresh_token'], // keep old one
			'created'       => time(),
		);
		update_option( GMAIL_AUTH_CREDENTIALS, $new_token );

		$this->gmail_access_token = $new_token['access_token'];
		$this->gmail_credentials  = $new_token;

		return $new_token;
	}
}
