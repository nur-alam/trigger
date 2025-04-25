<?php
/**
 * Plugin Name: Trigger
 * Version: 1.0.0
 * Requires at least: 5.3
 * Requires PHP: 7.4
 * Plugin URI: https://trigger.com
 * Description: Trigger for deliver your site email & manage email logs.
 * Author: nur
 * Author URI: https://nur.com
 * License: GPLv3 or later
 * Text Domain: trigger
 * Domain Path: /languages
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
			// new Init();
			// Initialize plugin.
			add_action( 'init', array( $this, 'init_plugin' ) );
		}

		/**
		 * Initialize plugin after init hook
		 *
		 * @return void
		 */
		public function init_plugin() {
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
			if ( empty( self::$plugin_data ) ) {
				if ( ! function_exists( 'get_plugin_data' ) ) {
					require_once ABSPATH . 'wp-admin/includes/plugin.php';
				}
				self::$plugin_data                 = get_plugin_data( __FILE__, false, false );
				self::$plugin_data['plugin_url']   = plugin_dir_url( __FILE__ );
				self::$plugin_data['plugin_path']  = plugin_dir_path( __FILE__ );
				self::$plugin_data['base_name']    = plugin_basename( __FILE__ );
				self::$plugin_data['templates']    = trailingslashit( plugin_dir_path( __FILE__ ) . 'templates' );
				self::$plugin_data['views']        = trailingslashit( plugin_dir_path( __FILE__ ) . 'views' );
				self::$plugin_data['assets']       = trailingslashit( plugin_dir_url( __FILE__ ) . 'assets' );
				self::$plugin_data['env']          = 'DEV';
				self::$plugin_data['nonce_key']    = 'trigger_nonce';
				self::$plugin_data['nonce_action'] = 'trigger';
			}
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
