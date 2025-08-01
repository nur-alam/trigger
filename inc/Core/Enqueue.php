<?php
/**
 * Enqueue Assets, styles & scripts
 *
 * @package Trigger\Core
 * @subpackage Trigger\Core\Enqueue
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Core;

use Trigger;
use Trigger\Frontend\CustomTemplate;
use Trigger\Helpers\UtilityHelper;
use Trigger\RestAPI\Routes;

/**
 * Enqueue styles & scripts
 */
class Enqueue {

	/**
	 * Register hooks
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'load_admin_scripts' ) );
		// add_action( 'wp_enqueue_scripts', array( __CLASS__, 'load_front_end_scripts' ) );
	}

	/**
	 * Load admin styles & scripts
	 *
	 * @since 1.0.0
	 *
	 * @param string $page The current admin page.
	 *
	 * @return void
	 */
	public static function load_admin_scripts( $page ): void {
		$plugin_data          = Trigger::plugin_data();
		$trigger_style_bundle = $plugin_data['plugin_url'] . 'assets/dist/css/style.min.css';
		$trigger_admin_bundle = $plugin_data['plugin_url'] . 'assets/dist/js/backend-bundle.min.js';
		$trigger_email_bundle = $plugin_data['plugin_url'] . 'assets/dist/js/email-builder-bundle.min.js';

		if ( 'toplevel_page_trigger' === $page ) {
			wp_enqueue_style(
				'trigger-style',
				$trigger_style_bundle,
				array(),
				TRIGGER_VERSION,
				'all'
			);
			wp_enqueue_script(
				'trigger-admin',
				$trigger_admin_bundle,
				array( 'wp-element', 'wp-i18n' ),
				TRIGGER_VERSION,
				true
			);
			wp_add_inline_script(
				'trigger-admin',
				'const _triggerObject = ' . wp_json_encode( self::scripts_data() ) . ';window._triggerObject=_triggerObject',
				'before'
			);
		}

		if ( 'trigger_page_trigger-email-builder' === $page ) {
			wp_enqueue_style(
				'trigger-style',
				$trigger_style_bundle,
				array(),
				TRIGGER_VERSION,
				'all'
			);
			wp_enqueue_script(
				'trigger-email-builder',
				$trigger_email_bundle,
				array( 'wp-element', 'wp-i18n' ),
				TRIGGER_VERSION,
				true
			);
			wp_add_inline_script(
				'trigger-email-builder',
				'const _triggerObject = ' . wp_json_encode( self::scripts_data() ) . ';window._triggerObject=_triggerObject',
				'before'
			);
		}
	}

	/**
	 * Load front end scripts
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function load_front_end_scripts(): void {
		$plugin_data             = Trigger::plugin_data();
		$trigger_frontend_bundle = Trigger::plugin_data()['plugin_url'] . 'assets/dist/js/trigger-frontend.min.js';
		wp_enqueue_script(
			'trigger-frontend',
			$trigger_frontend_bundle,
			array(),
			TRIGGER_VERSION,
			true
		);
		wp_add_inline_script(
			'trigger-frontend',
			'const _triggerObject = ' . wp_json_encode( self::scripts_data() ) . ';window._triggerObject=_triggerObject',
			'before'
		);
	}

	/**
	 * Add inline data in scripts
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public static function scripts_data() {
		$plugin_data = Trigger::plugin_data();
		$user_id     = get_current_user_id();
		$data        = array(
			'user_id'       => $user_id,
			'site_url'      => home_url(),
			'admin_url'     => admin_url(),
			'ajax_url'      => admin_url( 'admin-ajax.php' ),
			'rest_url'      => get_rest_url( null, Routes::$route_namespace ),
			'nonce_key'     => $plugin_data['nonce_key'],
			'nonce_value'   => wp_create_nonce( $plugin_data['nonce_action'] ),
			'wp_rest_nonce' => wp_create_nonce( 'wp_rest' ),
		);
		return $data;
	}

	/**
	 * Script text domain mapping to make JS script
	 * translate-able
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function script_text_domain() {
		$plugin_data = Trigger::plugin_data();
		wp_set_script_translations( 'trigger-backend', $plugin_data['plugin_url'] . 'assets/languages/' );
	}
}
