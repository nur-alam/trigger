<?php
/**
 * Global constants
 *
 * @package Trigger
 * @subpackage Trigger\Globals
 * @since 1.0.0
 */

use Trigger\Helpers\UtilityHelper;
use Trigger\Controllers\Provider\aws\SesMailer;
use Trigger\Controllers\Provider\gmail\GMailer;

/**
 * Authentication checking.
 *
 * @return  boolean
 */
function trigger_auth_check() {
	if ( ! is_user_logged_in() ) {
		return false;
	}
	return true;
}

/**
 * Get default email connection
 *
 * @return  array|boolean
 */
function trigger_get_default_provider() {
	$default_provider = get_option( TRIGGER_DEFAULT_EMAIL_PROVIDER, array() );

	if ( empty( $default_provider ) ) {
		return false;
	}
	return $default_provider;
}

/**
 * [trigger_get_provider description]
 *
 * @param provider $provider description.
 *
 * @return return description
 */
function trigger_get_provider( $provider ) {
	$trigger_email_config = get_option( TRIGGER_EMAIL_CONFIG, array() );
	if ( empty( $trigger_email_config ) ) {
		return false;
	}
	return $trigger_email_config[ $provider ];
}

/**
 * Get plugin data
 *
 * @return array
 */
function trigger_get_plugin_data() {
	if ( ! defined( 'TRIGGER_PLUGIN_INFO' ) ) {
		define( 'TRIGGER_PLUGIN_INFO', Trigger::plugin_data() );
	}
	return Trigger::plugin_data();
}

/**
 * Verify nonce and authentication.
 *
 * @param bool $check_auth Whether to check user authentication (default: true).
 * @return array{success: bool, message: string, code: int, data?: array} Returns array with verification result and sanitized data.
 */
function trigger_verify_request( $check_auth = true ) {
	// Check authentication if required
	if ( $check_auth && ! is_user_logged_in() ) {
		return array(
			'success' => false,
			'message' => __( 'Access denied! Please login to access this feature.', 'trigger' ),
			'code'    => 403,
		);
	}

	$plugin_info  = trigger_get_plugin_data();
	$nonce_key    = $plugin_info['nonce_key'];
	$nonce_action = $plugin_info['nonce_action'];

	// Verify nonce
	if ( $check_auth && ( ! isset( $_REQUEST[ $nonce_key ] )
		|| ! wp_verify_nonce(
			sanitize_text_field( wp_unslash( $_REQUEST[ $nonce_key ] ) ),
			$nonce_action
		) )
	) {
		return array(
			'success' => false,
			'message' => __( 'Invalid security token!', 'trigger' ),
			'code'    => 400,
		);
	}

	// Return success with sanitized POST data
	return array(
		'success' => true,
		'message' => __( 'Verification successful.', 'trigger' ),
		'code'    => 200,
		'data'    => UtilityHelper::sanitize_array( $_REQUEST ),
	);
}

if ( ! function_exists( 'wp_mail' ) ) :
	/**
	 * Sends an email, similar to PHP's mail function.
	 *
	 * A true return value does not automatically mean that the user received the
	 * email successfully. It just only means that the method used was able to
	 * process the request without any errors.
	 *
	 * The default content type is `text/plain` which does not allow using HTML.
	 * However, you can set the content type of the email by using the
	 * {@see 'wp_mail_content_type'} filter.
	 *
	 * The default charset is based on the charset used on the blog. The charset can
	 * be set using the {@see 'wp_mail_charset'} filter.
	 *
	 * @since 1.2.1
	 * @since 5.5.0 is_email() is used for email validation,
	 *              instead of PHPMailer's default validator.
	 *
	 * @global PHPMailer\PHPMailer\PHPMailer $phpmailer
	 *
	 * @param string|string[] $to          Array or comma-separated list of email addresses to send message.
	 * @param string          $subject     Email subject.
	 * @param string          $message     Message contents.
	 * @param string|string[] $headers     Optional. Additional headers.
	 * @param string|string[] $attachments Optional. Paths to files to attach.
	 * @return bool Whether the email was sent successfully.
	 * @throws PHPMailer\PHPMailer\Exception When there are issues sending the email.
	 */
	function wp_mail( $to, $subject, $message, $headers = '', $attachments = array() ) {
		// Compact the input, apply the filters, and extract them back out.

		/**
		 * Filters the wp_mail() arguments.
		 *
		 * @since 2.2.0
		 *
		 * @param array $args {
		 *     Array of the `wp_mail()` arguments.
		 *
		 *     @type string|string[] $to          Array or comma-separated list of email addresses to send message.
		 *     @type string          $subject     Email subject.
		 *     @type string          $message     Message contents.
		 *     @type string|string[] $headers     Additional headers.
		 *     @type string|string[] $attachments Paths to files to attach.
		 * }
		 */
		$atts = apply_filters( 'wp_mail', compact( 'to', 'subject', 'message', 'headers', 'attachments' ) );

		/**
		 * Filters whether to preempt sending an email.
		 *
		 * Returning a non-null value will short-circuit {@see wp_mail()}, returning
		 * that value instead. A boolean return value should be used to indicate whether
		 * the email was successfully sent.
		 *
		 * @since 5.7.0
		 *
		 * @param null|bool $return Short-circuit return value.
		 * @param array     $atts {
		 *     Array of the `wp_mail()` arguments.
		 *
		 *     @type string|string[] $to          Array or comma-separated list of email addresses to send message.
		 *     @type string          $subject     Email subject.
		 *     @type string          $message     Message contents.
		 *     @type string|string[] $headers     Additional headers.
		 *     @type string|string[] $attachments Paths to files to attach.
		 * }
		 */
		$pre_wp_mail = apply_filters( 'pre_wp_mail', null, $atts );

		if ( null !== $pre_wp_mail ) {
			return $pre_wp_mail;
		}

		if ( isset( $atts['to'] ) ) {
			$to = $atts['to'];
		}

		if ( ! is_array( $to ) ) {
			$to = explode( ',', $to );
		}

		if ( isset( $atts['subject'] ) ) {
			$subject = $atts['subject'];
		}

		if ( isset( $atts['message'] ) ) {
			$message = $atts['message'];
		}

		if ( isset( $atts['headers'] ) ) {
			$headers = $atts['headers'];
		}

		if ( isset( $atts['attachments'] ) ) {
			$attachments = $atts['attachments'];
		}

		if ( ! is_array( $attachments ) ) {
			$attachments = explode( "\n", str_replace( "\r\n", "\n", $attachments ) );
		}
		global $phpmailer;

		// (Re)create it, if it's gone missing.
		if ( ! ( $phpmailer instanceof PHPMailer\PHPMailer\PHPMailer ) ) {
			require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
			require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';
			require_once ABSPATH . WPINC . '/PHPMailer/Exception.php';
			$phpmailer = new PHPMailer\PHPMailer\PHPMailer( true ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

			$phpmailer::$validator = static function ( $email ) {
				return (bool) is_email( $email );
			};
		}

		// Headers.
		$cc       = array();
		$bcc      = array();
		$reply_to = array();

		if ( empty( $headers ) ) {
			$headers = array();
		} else {
			if ( ! is_array( $headers ) ) {
				/*
				 * Explode the headers out, so this function can take
				 * both string headers and an array of headers.
				 */
				$tempheaders = explode( "\n", str_replace( "\r\n", "\n", $headers ) );
			} else {
				$tempheaders = $headers;
			}
			$headers = array();

			// If it's actually got contents.
			if ( ! empty( $tempheaders ) ) {
				// Iterate through the raw headers.
				foreach ( (array) $tempheaders as $header ) {
					if ( ! str_contains( $header, ':' ) ) {
						if ( false !== stripos( $header, 'boundary=' ) ) {
							$parts    = preg_split( '/boundary=/i', trim( $header ) );
							$boundary = trim( str_replace( array( "'", '"' ), '', $parts[1] ) );
						}
						continue;
					}
					// Explode them out.
					list( $name, $content ) = explode( ':', trim( $header ), 2 );

					// Cleanup crew.
					$name    = trim( $name );
					$content = trim( $content );

					switch ( strtolower( $name ) ) {
						// Mainly for legacy -- process a "From:" header if it's there.
						case 'from':
							$bracket_pos = strpos( $content, '<' );
							if ( false !== $bracket_pos ) {
								// Text before the bracketed email is the "From" name.
								if ( $bracket_pos > 0 ) {
									$from_name = substr( $content, 0, $bracket_pos );
									$from_name = str_replace( '"', '', $from_name );
									$from_name = trim( $from_name );
								}

								$from_email = substr( $content, $bracket_pos + 1 );
								$from_email = str_replace( '>', '', $from_email );
								$from_email = trim( $from_email );

								// Avoid setting an empty $from_email.
							} elseif ( '' !== trim( $content ) ) {
								$from_email = trim( $content );
							}
							break;
						case 'content-type':
							if ( str_contains( $content, ';' ) ) {
								list( $type, $charset_content ) = explode( ';', $content );
								$content_type                   = trim( $type );
								if ( false !== stripos( $charset_content, 'charset=' ) ) {
									$charset = trim( str_replace( array( 'charset=', '"' ), '', $charset_content ) );
								} elseif ( false !== stripos( $charset_content, 'boundary=' ) ) {
									$boundary = trim( str_replace( array( 'BOUNDARY=', 'boundary=', '"' ), '', $charset_content ) );
									$charset  = '';
								}

								// Avoid setting an empty $content_type.
							} elseif ( '' !== trim( $content ) ) {
								$content_type = trim( $content );
							}
							break;
						case 'cc':
							$cc = array_merge( (array) $cc, explode( ',', $content ) );
							break;
						case 'bcc':
							$bcc = array_merge( (array) $bcc, explode( ',', $content ) );
							break;
						case 'reply-to':
							$reply_to = array_merge( (array) $reply_to, explode( ',', $content ) );
							break;
						default:
							// Add it to our grand headers array.
							$headers[ trim( $name ) ] = trim( $content );
							break;
					}
				}
			}
		}

		// Empty out the values that may be set.
		$phpmailer->clearAllRecipients();
		$phpmailer->clearAttachments();
		$phpmailer->clearCustomHeaders();
		$phpmailer->clearReplyTos();
		$phpmailer->Body    = ''; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->AltBody = ''; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

		// Set "From" name and email.

		// If we don't have a name from the input headers.
		if ( ! isset( $from_name ) ) {
			$from_name = 'WordPress';
		}

		/*
		 * If we don't have an email from the input headers, default to wordpress@$sitename
		 * Some hosts will block outgoing mail from this address if it doesn't exist,
		 * but there's no easy alternative. Defaulting to admin_email might appear to be
		 * another option, but some hosts may refuse to relay mail from an unknown domain.
		 * See https://core.trac.wordpress.org/ticket/5007.
		 */
		if ( ! isset( $from_email ) ) {
			// Get the site domain and get rid of www.
			$sitename   = wp_parse_url( network_home_url(), PHP_URL_HOST );
			$from_email = 'wordpress@';

			if ( null !== $sitename ) {
				if ( str_starts_with( $sitename, 'www.' ) ) {
					$sitename = substr( $sitename, 4 );
				}

				$from_email .= $sitename;
			}
		}

		/**
		 * Filters the email address to send from.
		 *
		 * @since 2.2.0
		 *
		 * @param string $from_email Email address to send from.
		 */
		$from_email = apply_filters( 'wp_mail_from', $from_email );

		/**
		 * Filters the name to associate with the "from" email address.
		 *
		 * @since 2.3.0
		 *
		 * @param string $from_name Name associated with the "from" email address.
		 */
		$from_name = apply_filters( 'wp_mail_from_name', $from_name );

		try {
			$phpmailer->setFrom( $from_email, $from_name, false );
		} catch ( PHPMailer\PHPMailer\Exception $e ) {
			$mail_error_data                             = compact( 'to', 'subject', 'message', 'headers', 'attachments' );
			$mail_error_data['phpmailer_exception_code'] = $e->getCode();

			/** This filter is documented in wp-includes/pluggable.php */
			do_action( 'wp_mail_failed', new WP_Error( 'wp_mail_failed', $e->getMessage(), $mail_error_data ) );

			return false;
		}

		// Set mail's subject and body.
		$phpmailer->Subject = $subject; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->Body    = $message; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

		// Set destination addresses, using appropriate methods for handling addresses.
		$address_headers = compact( 'to', 'cc', 'bcc', 'reply_to' );

		foreach ( $address_headers as $address_header => $addresses ) {
			if ( empty( $addresses ) ) {
				continue;
			}

			foreach ( (array) $addresses as $address ) {
				try {
					// Break $recipient into name and address parts if in the format "Foo <bar@baz.com>".
					$recipient_name = '';

					if ( preg_match( '/(.*)<(.+)>/', $address, $matches ) ) {
						if ( count( $matches ) === 3 ) {
							$recipient_name = $matches[1];
							$address        = $matches[2];
						}
					}

					switch ( $address_header ) {
						case 'to':
							$phpmailer->addAddress( $address, $recipient_name );
							break;
						case 'cc':
							$phpmailer->addCc( $address, $recipient_name );
							break;
						case 'bcc':
							$phpmailer->addBcc( $address, $recipient_name );
							break;
						case 'reply_to':
							$phpmailer->addReplyTo( $address, $recipient_name );
							break;
					}
				} catch ( PHPMailer\PHPMailer\Exception $e ) {
					continue;
				}
			}
		}

		// Set to use PHP's mail().
		$phpmailer->isMail();

		// Set Content-Type and charset.

		// If we don't have a Content-Type from the input headers.
		if ( ! isset( $content_type ) ) {
			$content_type = 'text/plain';
		}

		/**
		 * Filters the wp_mail() content type.
		 *
		 * @since 2.3.0
		 *
		 * @param string $content_type Default wp_mail() content type.
		 */
		$content_type = apply_filters( 'wp_mail_content_type', $content_type );

		$phpmailer->ContentType = $content_type; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

		// Set whether it's plaintext, depending on $content_type.
		if ( 'text/html' === $content_type ) {
			$phpmailer->isHTML( true );
		}

		// If we don't have a charset from the input headers.
		if ( ! isset( $charset ) ) {
			$charset = get_bloginfo( 'charset' );
		}

		/**
		 * Filters the default wp_mail() charset.
		 *
		 * @since 2.3.0
		 *
		 * @param string $charset Default email charset.
		 */
		$phpmailer->CharSet = apply_filters( 'wp_mail_charset', $charset ); // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

		// Set custom headers.
		if ( ! empty( $headers ) ) {
			foreach ( (array) $headers as $name => $content ) {
				// Only add custom headers not added automatically by PHPMailer.
				if ( ! in_array( $name, array( 'MIME-Version', 'X-Mailer' ), true ) ) {
					try {
						$phpmailer->addCustomHeader( sprintf( '%1$s: %2$s', $name, $content ) );
					} catch ( PHPMailer\PHPMailer\Exception $e ) {
						continue;
					}
				}
			}

			if ( false !== stripos( $content_type, 'multipart' ) && ! empty( $boundary ) ) {
				$phpmailer->addCustomHeader( sprintf( 'Content-Type: %s; boundary="%s"', $content_type, $boundary ) );
			}
		}

		if ( ! empty( $attachments ) ) {
			foreach ( $attachments as $filename => $attachment ) {
				$filename = is_string( $filename ) ? $filename : '';

				try {
					$phpmailer->addAttachment( $attachment, $filename );
				} catch ( PHPMailer\PHPMailer\Exception $e ) {
					continue;
				}
			}
		}

		/**
		 * Fires after PHPMailer is initialized.
		 *
		 * @since 2.2.0
		 *
		 * @param PHPMailer $phpmailer The PHPMailer instance (passed by reference).
		 */
		do_action_ref_array( 'phpmailer_init', array( &$phpmailer ) );

		$mail_data = compact( 'to', 'subject', 'message', 'headers', 'attachments' );

		try {
			$default_provider = trigger_get_default_provider();
			$send             = false;
			if ( 'ses' === $default_provider['provider'] ) {
				$headers    = array_merge( $headers, array( 'Content-Type: text/html' ) );
				$ses_mailer = new SesMailer();
				$send       = $ses_mailer->send_email( $to, $subject, $message, $headers, $attachments, false );
				if ( false === $send ) {
					throw new PHPMailer\PHPMailer\Exception( 'Failed to send email using SES' );
				}
			} elseif ( 'gmail' === $default_provider['provider'] ) {
				$gmailer = new GMailer();
				$send    = $gmailer->send_email( $to, $subject, $message, $headers, $attachments, false );
			} else {
				$send = $phpmailer->send();
			}

			/**
			 * Fires after PHPMailer has successfully sent an email.
			 *
			 * The firing of this action does not necessarily mean that the recipient(s) received the
			 * email successfully. It only means that the `send` method above was able to
			 * process the request without any errors.
			 *
			 * @since 5.9.0
			 *
			 * @param array $mail_data {
			 *     An array containing the email recipient(s), subject, message, headers, and attachments.
			 *
			 *     @type string[] $to          Email addresses to send message.
			 *     @type string   $subject     Email subject.
			 *     @type string   $message     Message contents.
			 *     @type string[] $headers     Additional headers.
			 *     @type string[] $attachments Paths to files to attach.
			 * }
			 */
			do_action( 'wp_mail_succeeded', $mail_data );

			return $send;
		} catch ( PHPMailer\PHPMailer\Exception $e ) {
			$mail_data['phpmailer_exception_code'] = $e->getCode();

			/**
			 * Fires after a PHPMailer\PHPMailer\Exception is caught.
			 *
			 * @since 4.4.0
			 *
			 * @param WP_Error $error A WP_Error object with the PHPMailer\PHPMailer\Exception message, and an array
			 *                        containing the mail recipient, subject, message, headers, and attachments.
			 */
			do_action( 'wp_mail_failed', new WP_Error( 'wp_mail_failed', $e->getMessage(), $mail_data ) );

			return false;
		}
	}
endif;
