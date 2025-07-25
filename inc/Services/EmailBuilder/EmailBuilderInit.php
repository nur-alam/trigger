<?php
/**
 * Email Builder Initialization
 *
 * @package Trigger\Services\EmailBuilder
 * @subpackage Trigger\Services\EmailBuilder\EmailBuilderInit
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Services\EmailBuilder;

use Trigger\Services\EmailBuilder\EmailBuilderAjaxHandler;
use Trigger\Services\EmailBuilder\EmailBuilderRestController;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * EmailBuilderInit class for initializing email builder services
 */
class EmailBuilderInit {

	/**
	 * AJAX handler instance
	 *
	 * @since 1.0.0
	 *
	 * @var EmailBuilderAjaxHandler
	 */
	private $ajax_handler;

	/**
	 * REST controller instance
	 *
	 * @since 1.0.0
	 *
	 * @var EmailBuilderRestController
	 */
	private $rest_controller;

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->ajax_handler    = new EmailBuilderAjaxHandler();
		$this->rest_controller = new EmailBuilderRestController();

		$this->init_hooks();
	}

	/**
	 * Initialize hooks
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	private function init_hooks() {
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	/**
	 * Register REST API routes
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_rest_routes() {
		$this->rest_controller->register_routes();
	}
}
