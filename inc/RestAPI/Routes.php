<?php
/**
 * Register Routes
 *
 * @package Trigger\Core
 * @subpackage Trigger\Core\EmailConfiguration
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\RestAPI;

use Trigger\Controllers\WordsController;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Register supported routes
 */
class Routes {

	/**
	 * Route namespace
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public static $route_namespace = 'trigger/v1';

	/**
	 * Register hooks
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'rest_api_init', __CLASS__ . '::register_routes' );
	}

	/**
	 * Register the available routes
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function register_routes() {
		foreach ( self::endpoints() as $endpoint ) {
			register_rest_route(
				self::$route_namespace,
				$endpoint['endpoint'] . $endpoint['url_params'],
				array(
					'methods'             => $endpoint['method'],
					'callback'            => $endpoint['callback'],
					'permission_callback' => $endpoint['permission_callback'],
					// 'args'                => $endpoint['args'],
				)
			);
		}
		// register_rest_route(
		// self::$route_namespace,
		// 'words',
		// array(
		// 'methods'             => WP_REST_Server::READABLE,
		// 'callback'            => array( ( new WordsController() ), 'get_words' ),
		// 'permission_callback' => '',
		// 'args'                => array(
		// 'search' => array(
		// 'required'          => false,
		// 'validate_callback' => function ( $param ) {
		// return is_string( $param );
		// },
		// ),
		// 'offset' => array(
		// 'required'          => false,
		// 'validate_callback' => function ( $param ) {
		// return is_numeric( $param );
		// },
		// ),
		// 'limit'  => array(
		// 'required'          => false,
		// 'validate_callback' => function ( $param ) {
		// return is_numeric( $param );
		// },
		// ),
		// ),
		// )
		// );
	}

	/**
	 * Get available endpoints
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public static function endpoints() {

		// Trigger routes.
		return array();
	}
}
