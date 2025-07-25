<?php
/**
 * Email Builder AJAX Handler
 *
 * @package Trigger\Services\EmailBuilder
 * @subpackage Trigger\Services\EmailBuilder\EmailBuilderAjaxHandler
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Services\EmailBuilder;

use Trigger\Services\EmailBuilder\EmailBuilderService;
use Trigger\Traits\JsonResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * EmailBuilderAjaxHandler class for handling AJAX requests
 */
class EmailBuilderAjaxHandler {

	use JsonResponse;

	/**
	 * Email builder service instance
	 *
	 * @since 1.0.0
	 *
	 * @var EmailBuilderService
	 */
	private $service;

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->service = new EmailBuilderService();
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
		// AJAX hooks for logged-in users.
		add_action( 'wp_ajax_trigger_save_email_template', array( $this, 'save_template' ) );
		add_action( 'wp_ajax_trigger_load_email_template', array( $this, 'load_template' ) );
		add_action( 'wp_ajax_trigger_fetch_email_templates', array( $this, 'fetch_templates' ) );
		add_action( 'wp_ajax_trigger_delete_email_template', array( $this, 'delete_template' ) );
		add_action( 'wp_ajax_trigger_duplicate_email_template', array( $this, 'duplicate_template' ) );
		add_action( 'wp_ajax_trigger_update_email_template', array( $this, 'update_template' ) );
	}

	/**
	 * Verify nonce and user capabilities
	 *
	 * @since 1.0.0
	 *
	 * @return bool True if valid, false otherwise.
	 */
	// private function verify_request() {
	// Verify nonce.
	// if ( ! wp_verify_nonce( $_POST['nonce'] ?? '', 'trigger_ajax_nonce' ) ) {
	// wp_send_json_error( array( 'message' => __( 'Invalid nonce.', 'trigger' ) ) );
	// return false;
	// }

	// Check user capabilities.
	// if ( ! current_user_can( 'manage_options' ) ) {
	// wp_send_json_error( array( 'message' => __( 'Insufficient permissions.', 'trigger' ) ) );
	// return false;
	// }

	// return true;
	// }

	/**
	 * Handle save template AJAX request
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function save_template() {
		// $verify = trigger_verify_request();
		// if ( ! $verify['success'] ) {
		// return $this->json_response( $verify['message'], null, $verify['code'] );
		// }

		// $params = $verify['data'];

		$name        = sanitize_text_field( $_POST['name'] ?? '' );
		$components  = $_POST['components'] ?? '';
		$description = sanitize_textarea_field( $_POST['description'] ?? '' );
		$thumbnail   = esc_url_raw( $_POST['thumbnail'] ?? '' );

		// Decode components if it's a JSON string.
		if ( is_string( $components ) ) {
			$components = json_decode( stripslashes( $components ), true );
		}

		$result = $this->service->save_template( $name, $components, $description, $thumbnail );

		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
		}
	}

	/**
	 * Handle load template AJAX request
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function load_template() {
		// if ( ! $this->verify_request() ) {
		// return;
		// }

		$template_id = absint( $_POST['template_id'] ?? 0 );

		$result = $this->service->load_template( $template_id );

		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
		}
	}

	/**
	 * Handle fetch templates AJAX request
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function fetch_templates() {
		// if ( ! $this->verify_request() ) {
		// return;
		// }

		$args = array(
			'limit'   => absint( $_POST['limit'] ?? 50 ),
			'offset'  => absint( $_POST['offset'] ?? 0 ),
			'orderby' => sanitize_text_field( $_POST['orderby'] ?? 'created_at' ),
			'order'   => sanitize_text_field( $_POST['order'] ?? 'DESC' ),
			'search'  => sanitize_text_field( $_POST['search'] ?? '' ),
		);

		$result = $this->service->fetch_templates( $args );

		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
		}
	}

	/**
	 * Handle delete template AJAX request
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function delete_template() {
		if ( ! $this->verify_request() ) {
			return;
		}

		$template_id = absint( $_POST['template_id'] ?? 0 );

		$result = $this->service->delete_template( $template_id );

		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
		}
	}

	/**
	 * Handle duplicate template AJAX request
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function duplicate_template() {
		if ( ! $this->verify_request() ) {
			return;
		}

		$template_id = absint( $_POST['template_id'] ?? 0 );
		$new_name    = sanitize_text_field( $_POST['new_name'] ?? '' );

		$result = $this->service->duplicate_template( $template_id, $new_name );

		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
		}
	}

	/**
	 * Handle update template AJAX request
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function update_template() {
		if ( ! $this->verify_request() ) {
			return;
		}

		$template_id = absint( $_POST['template_id'] ?? 0 );
		$data        = array();

		// Sanitize and prepare update data.
		if ( isset( $_POST['name'] ) ) {
			$data['name'] = sanitize_text_field( $_POST['name'] );
		}

		if ( isset( $_POST['description'] ) ) {
			$data['description'] = sanitize_textarea_field( $_POST['description'] );
		}

		if ( isset( $_POST['components'] ) ) {
			$components = $_POST['components'];
			if ( is_string( $components ) ) {
				$components = json_decode( stripslashes( $components ), true );
			}
			$data['components'] = $components;
		}

		if ( isset( $_POST['thumbnail'] ) ) {
			$data['thumbnail'] = esc_url_raw( $_POST['thumbnail'] );
		}

		$result = $this->service->update_template( $template_id, $data );

		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
		}
	}
}
