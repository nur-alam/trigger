<?php
/**
 * LogRetention controller class
 *
 * @package Trigger\Controllers
 * @author Trigger <trigger@gmail.com>
 * @link https://trigger.com
 * @since 1.0.0
 */

namespace Trigger\Controllers;

use Trigger\Traits\JsonResponse;

/**
 * LogRetention class
 */
class LogRetention {

	use JsonResponse;

	/**
	 * Register hooks
	 */
	public function __construct() {
		add_action( 'wp_ajax_get_log_retention', array( $this, 'get_log_retention' ) );
		add_action( 'wp_ajax_update_log_retention', array( $this, 'update_log_retention' ) );
	}

	/**
	 * Get log retention
	 *
	 * @return object
	 */
	public function get_log_retention() {
		$log_retention = get_option( TRIGGER_LOG_RETENTION, TRIGGER_LOG_RETENTION_DEFAULT );

		if ( empty( $log_retention ) ) {
			$log_retention = TRIGGER_LOG_RETENTION_DEFAULT;
		}

		return $this->json_response( __( 'Log retention fetched successfully', 'trigger' ), $log_retention, 200 );
	}

	/**
	 * Update log retention
	 *
	 * @return object
	 */
	public function update_log_retention() {
		$verify = trigger_verify_request();
		if ( ! $verify['success'] ) {
			return $this->json_response( $verify['message'], null, $verify['code'] );
		}

		$params = $verify['data'];
		$data   = json_decode( $params['data'], true );

		$updated = update_option( TRIGGER_LOG_RETENTION, $data['days'] );

		if ( ! $updated ) {
			return $this->json_response( __( 'Failed to update log retention', 'trigger' ), null, 400 );
		}

		return $this->json_response( __( 'Log retention updated successfully', 'trigger' ), $data['days'], 200 );
	}
}
