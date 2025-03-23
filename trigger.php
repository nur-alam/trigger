<?php
/**
 * Plugin Name: Trigger
 * Version: 1.0.0
 * Requires at least: 5.3
 * Requires PHP: 7.4
 * Plugin URI: https://trigger.com
 * Description: Trigger for Managing Products & License
 * Author: nur
 * Author URI: https://nur.com
 * License: GPLv2 or later
 * Text Domain: trigger
 * Domain Path: /assets/languages
 *
 * @package trigger
 */

use Trigger\Init;
use Trigger\Database\Migration;
use Trigger\Frontend\Pages\PageManager;


if ( ! class_exists( 'Trigger' ) ) {

	/**
	 * Trigger main class that trigger the plugin
	 */
	final class Trigger {

		/**
		 * Plugin meta data
		 *
		 * @since v1.0.0
		 *
		 * @var $plugin_data
		 */
		private static $plugin_data = array();

		/**
		 * Plugin instance
		 *
		 * @since 1.0.0
		 *
		 * @var $instance
		 */
		public static $instance = null;

		/**
		 * Payment Gateway instance
		 *
		 * @since 1.0.0
		 *
		 * @var $instance
		 */
		private static $payment_gateway = null;

		/**
		 * Register hooks and load dependent files
		 *
		 * @since v1.0.0
		 *
		 * @return void
		 */
		public function __construct() {
			require_once 'constants.php';

			if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
				include_once __DIR__ . '/vendor/autoload.php';
			}

			// for rest api basic auth for tools like postman, set password from application password under user edit.
			add_filter( 'wp_is_application_passwords_available', '__return_true' );

			register_activation_hook( __FILE__, array( __CLASS__, 'register_activation' ) );
			register_deactivation_hook( __FILE__, array( __CLASS__, 'register_deactivation' ) );
			add_action( 'init', array( __CLASS__, 'load_textdomain' ) );

			// Initialize plugin.
			new Init();
		}

		/**
		 * Plugin meta data
		 *
		 * @since v1.0.0
		 *
		 * @return array  contains plugin meta data
		 */
		public static function plugin_data() {
			if ( ! function_exists( 'get_plugin_data' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}
			self::$plugin_data                 = get_plugin_data( __FILE__ );
			self::$plugin_data['plugin_url']   = plugin_dir_url( __FILE__ );
			self::$plugin_data['plugin_path']  = plugin_dir_path( __FILE__ );
			self::$plugin_data['base_name']    = plugin_basename( __FILE__ );
			self::$plugin_data['templates']    = trailingslashit( plugin_dir_path( __FILE__ ) . 'templates' );
			self::$plugin_data['views']        = trailingslashit( plugin_dir_path( __FILE__ ) . 'views' );
			self::$plugin_data['assets']       = trailingslashit( plugin_dir_url( __FILE__ ) . 'assets' );
			self::$plugin_data['base_name']    = plugin_basename( __FILE__ );
			self::$plugin_data['env']          = 'DEV';
			self::$plugin_data['nonce_key']    = 'trigger_nonce';
			self::$plugin_data['nonce_action'] = 'trigger';
			return self::$plugin_data;
		}

		/**
		 * Create and return instance of this plugin
		 *
		 * @return self  instance of plugin
		 */
		public static function instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Do some stuff after activate plugin
		 *
		 * @return void
		 */
		public static function register_activation() {
			update_option( '_trigger_install_time', time() );

			// Migrate DB.
			Migration::migrate();

			// Create dynamic pages .
			// PageManager::create_dynamic_pages();
			// Flush rewrite rules.
			flush_rewrite_rules();
		}

		/**
		 * Do some stuff after deactivate plugin
		 *
		 * @return void
		 */
		public static function register_deactivation() {
			flush_rewrite_rules();
		}

		/**
		 * Load plugin text domain
		 *
		 * @return void
		 */
		public static function load_textdomain() {
			load_plugin_textdomain( 'trigger', false, dirname( plugin_basename( __FILE__ ) ) . '/assets/languages' );
		}
	}

	// trigger.
	Trigger::instance();
}

use Trigger\Core\SesMailer;

if ( ! function_exists( 'wp_mail' ) ) {
	// **
	// * Send email using AWS SES
	// *
	// * @param string $to Email address to send the email to .
	// * @param string $subject Email subject .
	// * @param string $message Email message .
	// * @param string $headers Email headers .
	// * @param array  $attachments Email attachments .
	// *
	// * @return bool true if email is sent successfully, false otherwise .
	// *
	function wp_mail( $to, $subject, $message, $headers = '', $attachments = array() ) {
		$default_provider = get_default_provider();
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
			$phpmailer = new PHPMailer\PHPMailer\PHPMailer( true );

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
		$phpmailer->Body    = '';
		$phpmailer->AltBody = '';

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
		$phpmailer->Subject = $subject;
		$phpmailer->Body    = $message;

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

		$phpmailer->ContentType = $content_type;

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
		$phpmailer->CharSet = apply_filters( 'wp_mail_charset', $charset );

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

		// Send!
		try {
			$default_provider = get_default_provider();
			$send = false;
			if('ses' === $default_provider['provider']) {
				$ses_mailer = new SesMailer();
				$send     = $ses_mailer->send_email( $to, $subject, $message, $headers, $attachments );
				if(false === $send) {
					throw new PHPMailer\PHPMailer\Exception('Failed to send email using SES');
				}
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
}
