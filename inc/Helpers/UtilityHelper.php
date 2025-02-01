<?php
/**
 * Contains Plugin's utilities functions
 * Initialize the plugin
 *
 * @package Trigger\Core
 * @subpackage Trigger\Core\EmailConfiguration
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Helpers;

use Trigger;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Plugin's utilities
 */
class UtilityHelper {

	/**
	 * Load template file
	 *
	 * @param string $template  required template relative file path with .php ext.
	 * @param mixed  $data  data that will be available on the file.
	 * @param bool   $once  if true file will be included once.
	 *
	 * @return void
	 */
	public static function load_template( string $template, $data = array(), $once = false ) {
		$plugin_data   = Trigger::plugin_data();
		$template_path = $plugin_data['templates'] . $template;
		if ( file_exists( $template_path ) ) {
			if ( $once ) {
				include_once $template_path;
			} else {
				include $template_path;
			}
		} else {
			esc_html( "{$template_path} file not exists" );
		}
	}

	/**
	 * Sanitize get value through callable function
	 *
	 * @param string   $key required $_GET key.
	 * @param callable $callback callable WP sanitize/esc func.
	 *
	 * @return string
	 */
	public static function sanitize_get_field( string $key, callable $callback = null ) {
		$data = $_GET;
		if ( is_null( $callback ) ) {
			$callback = 'sanitize_text_field';
		}
		 //phpcs:ignore
		if ( isset( $_GET[ $key ] ) ) {
			return call_user_func( $callback, wp_unslash( $_GET[ $key ] ) ); //phpcs:ignore
		}
		return '';
	}

	/**
	 * Sanitize get value through callable function
	 *
	 * @param string   $key required $_GET key.
	 * @param callable $callback callable WP sanitize/esc func.
	 *
	 * @return string
	 */
	public static function sanitize_post_field( string $key, callable $callback = null ) {
		if ( is_null( $callback ) ) {
			$callback = 'sanitize_text_field';
		}
		 //phpcs:ignore
		if ( isset( $_POST[ $key ] ) ) {
			return call_user_func( $callback, wp_unslash( $_POST[ $key ] ) ); //phpcs:ignore
		}
		return '';
	}

	/**
	 * Verify nonce not it verified then die
	 *
	 * @since 1.0.0
	 *
	 * @return bool if die false otherwise it will die
	 */
	public static function verify_nonce() {
		$plugin_data = Trigger::plugin_data();
		return isset( $_POST[ $plugin_data['nonce_key'] ] ) && wp_verify_nonce( $_POST[ $plugin_data['nonce_key'] ], $plugin_data['nonce_action'] ); //phpcs:ignore
	}

	/**
	 * Send email wrapper of wp_mail function
	 *
	 * @since 1.0.0
	 *
	 * @param string|string[] $to Array or comma-separated lists.
	 * @param string          $subject mail subject.
	 * @param string          $message body body.
	 * @param array           $custom_headers mail headers default text/html.
	 * @param string|string[] $attachments mail attachments.
	 *
	 * @return bool
	 */
	public static function send_mail( $to, $subject, $message, $custom_headers = array(), $attachments = array() ) {
		$headers[] = 'Content-Type: text/html; charset=UTF-8';
		if ( ! empty( $custom_headers ) ) {
			$headers = wp_parse_args( $headers, $custom_headers );
		}
		$success = true;
		try {
			$success = \wp_mail( $to, $subject, $message, $headers, $attachments );
		} catch ( \Throwable $th ) {
			$success = false;
		}

		return $success;
	}
}
