<?php
/**
 * WordsController logics
 *
 * @package Trigger\Controllers
 * @subpackage Trigger\Controllers\WordsController
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Controllers;

use Exception;
use Trigger\Models\WordsModel;
use Trigger\Traits\JsonResponse;
use Trigger\Traits\RestResponse;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * WordsController logics
 */
class WordsController {

	use RestResponse;
	use JsonResponse;

	/**
	 * Plan model
	 *
	 * @since 1.0.0
	 *
	 * @var object
	 */
	private $words_model;

	/**
	 * Get the model
	 *
	 * @since 1.0.0
	 *
	 * @return object
	 */
	public function get_model() {
		return $this->words_model;
	}

	/**
	 * Resolve dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->words_model = new WordsModel();
	}

	/**
	 * This function hold logics of getting words.
	 *
	 * @param WP_REST_Request $request object.
	 *
	 * @return  mixed WP_REST_Response|WP_Error
	 */
	public function get_words( WP_REST_Request $request ) {
		$params = $request->get_params();
		$data   = array(
			'order'  => ! empty( $params['order'] ) ? $params['order'] : 'DESC',
			'limit'  => $params['limit'] ?? 5,
			'offset' => $params['offset'] ?? 0,
			'search' => $params['search'] ?? '',
		);
		try {
			$result = $this->words_model->get_words( $data );
			return $this->response( 'Word updated successfully', $result );
		} catch ( \Throwable $th ) {
			return $this->response( 'Something went wrong!', '', $this->failed_code );
		}
	}

	/**
	 * This function creates a Word in a PHP application after verifying the nonce,
	 * user privileges, and sanitizing the request.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request request object.
	 *
	 * @return mixed WP_REST_Response|WP_Error
	 */
	public function create_word( WP_REST_Request $request ) {
		$data = $request->get_params();
		try {
			$create_word = $this->words_model->create_word( $data );
			if ( $create_word ) {
				return $this->response( 'Word updated successfully', $create_word );
			} else {
				return $this->response( 'Word not updated!', $create_word );
			}
		} catch ( \Throwable $th ) {
			return $this->response( 'Something went wrong!', '', $this->failed_code );
		}
		// return wp_send_json( $create_word );
	}


	/**
	 * This function creates a plan in a PHP application after verifying the nonce,
	 * user privileges, and sanitizing the request.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request request object.
	 *
	 * @return mixed WP_REST_Response|WP_Error
	 */
	public function create_bookmark( WP_REST_Request $request ) {
		$data = $request->get_params();
		try {
			$create_bookmark = $this->words_model->create_bookmark( $data );
			if ( $create_bookmark ) {
				return $this->response( 'Bookmark Successfull!', $create_bookmark );
			} else {
				return $this->response( 'Something went wrong!!', '', $this->failed_code );
			}
		} catch ( \Throwable $th ) {
			return $this->response( 'Something went wrong!!', '', $this->failed_code );
		}
	}

	/**
	 * This function creates a plan in a PHP application after verifying the nonce,
	 * user privileges, and sanitizing the request.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request request object.
	 *
	 * @return mixed WP_REST_Response|WP_Error
	 */
	public function update_word( WP_REST_Request $request ) {
		$data        = $request->get_params();
		$update_word = $this->words_model->update_word( $data );

		return $this->response( 'Word not updated!', $update_word );

		return wp_send_json( $update_word );
	}

	/**
	 * This function creates a plan in a PHP application after verifying the nonce,
	 * user privileges, and sanitizing the request.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request request object.
	 *
	 * @return mixed WP_REST_Response|WP_Error
	 */
	public function delete_word( WP_REST_Request $request ) {
		$data        = $request->get_params();
		$detete_word = $this->words_model->delete_word( $data );

		if ( ! $detete_word ) {
			return wp_send_json_error( 'Something went wrong!' );
		}

		return wp_send_json( $detete_word );
	}

	/**
	 * Validate description.
	 *
	 * @return  [type]  [return description]
	 */
	public function validate() {
		return true;
	}
}
