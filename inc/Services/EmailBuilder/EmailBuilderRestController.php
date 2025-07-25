<?php
/**
 * Email Builder REST API Controller
 *
 * @package Trigger\Services\EmailBuilder
 * @subpackage Trigger\Services\EmailBuilder\EmailBuilderRestController
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Services\EmailBuilder;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use Trigger\Services\EmailBuilder\EmailBuilderService;
use Trigger\Traits\JsonResponse;
use Trigger\Traits\RestResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * EmailBuilderRestController class for handling REST API requests
 */
class EmailBuilderRestController extends WP_REST_Controller {

	use JsonResponse;
	use RestResponse;

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
		$this->namespace = 'trigger/v1';
		$this->rest_base = 'email-templates';
		$this->service   = new EmailBuilderService();
	}

	/**
	 * Register the routes for the objects of the controller.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => $this->get_collection_params(),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(
						'id' => array(
							'description' => __( 'Unique identifier for the template.', 'trigger' ),
							'type'        => 'integer',
						),
					),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)/duplicate',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'duplicate_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'                => array(
					'id'   => array(
						'description' => __( 'Unique identifier for the template.', 'trigger' ),
						'type'        => 'integer',
					),
					'name' => array(
						'description' => __( 'Name for the duplicated template.', 'trigger' ),
						'type'        => 'string',
					),
				),
			)
		);
	}

	/**
	 * Get a collection of items
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$per_page = $request->get_param( 'per_page' );
		$page     = $request->get_param( 'page' );
		$orderby  = $request->get_param( 'orderby' );
		$order    = $request->get_param( 'order' );
		$search   = $request->get_param( 'search' );

		$args = array(
			'limit'   => $per_page ? $per_page : 50,
			'offset'  => ( $page - 1 ) * ( $per_page ? $per_page : 50 ),
			'orderby' => $orderby ? $orderby : 'created_at',
			'order'   => $order ? $order : 'DESC',
			'search'  => $search ? $search : '',
		);

		$result = $this->service->fetch_templates( $args );

		if ( ! $result['success'] ) {
			return new WP_Error( 'fetch_failed', $result['message'], array( 'status' => 500 ) );
		}

		$data = array();
		foreach ( $result['templates'] as $template ) {
			$data[] = $this->prepare_item_for_response( $template, $request );
		}
		// $data     = $this->prepare_item_for_response( $result['templates'], $request );
		$response = rest_ensure_response( $data );
		$response->header( 'X-WP-Total', $result['total'] );
		$response->header( 'X-WP-TotalPages', ceil( $result['total'] / $args['limit'] ) );
		return $response;
	}

	/**
	 * Get one item from the collection
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_item( $request ) {
		$id     = (int) $request['id'];
		$result = $this->service->load_template( $id );

		if ( ! $result['success'] ) {
			return new WP_Error( 'template_not_found', $result['message'], array( 'status' => 404 ) );
		}

		$data = $this->prepare_item_for_response( $result['template'], $request );

		return rest_ensure_response( $data );
	}

	/**
	 * Create one item from the collection
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		$name        = $request->get_param( 'name' );
		$components  = $request->get_param( 'components' );
		$description = $request->get_param( 'description' );
		$thumbnail   = $request->get_param( 'thumbnail' );

		$description = $description ? $description : '';
		$thumbnail   = $thumbnail ? $thumbnail : '';

		$result = $this->service->save_template( $name, $components, $description, $thumbnail );

		if ( ! $result['success'] ) {
			return new WP_Error( 'create_failed', $result['message'], array( 'status' => 400 ) );
		}

		$template = $this->service->load_template( $result['template_id'] );
		$data     = $this->prepare_item_for_response( $template['template'], $request );

		return rest_ensure_response( $data );
	}

	/**
	 * Update one item from the collection
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $request ) {
		$id   = (int) $request['id'];
		$data = array();

		$allowed_fields = array( 'name', 'description', 'components', 'thumbnail' );
		foreach ( $allowed_fields as $field ) {
			if ( $request->has_param( $field ) ) {
				$data[ $field ] = $request->get_param( $field );
			}
		}

		$result = $this->service->update_template( $id, $data );

		if ( ! $result['success'] ) {
			return new WP_Error( 'update_failed', $result['message'], array( 'status' => 400 ) );
		}

		$template = $this->service->load_template( $id );
		$data     = $this->prepare_item_for_response( $template['template'], $request );

		return rest_ensure_response( $data );
	}

	/**
	 * Delete one item from the collection
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$id     = (int) $request['id'];
		$result = $this->service->delete_template( $id );

		if ( ! $result['success'] ) {
			return new WP_Error( 'delete_failed', $result['message'], array( 'status' => 400 ) );
		}

		return rest_ensure_response( array( 'deleted' => true ) );
	}

	/**
	 * Duplicate one item from the collection
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function duplicate_item( $request ) {
		$id       = (int) $request['id'];
		$new_name = $request->get_param( 'name' );
		$new_name = $new_name ? $new_name : '';

		$result = $this->service->duplicate_template( $id, $new_name );

		if ( ! $result['success'] ) {
			return new WP_Error( 'duplicate_failed', $result['message'], array( 'status' => 400 ) );
		}

		$template = $this->service->load_template( $result['template_id'] );
		$data     = $this->prepare_item_for_response( $template['template'], $request );

		return rest_ensure_response( $data );
	}

	/**
	 * Prepare the item for the REST response
	 *
	 * @since 1.0.0
	 *
	 * @param mixed           $item    WordPress representation of the item.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $item, $request ) {
		$data = array(
			'id'          => (int) $item->id,
			'name'        => $item->name,
			'description' => $item->description,
			'components'  => $item->components,
			'thumbnail'   => $item->thumbnail,
			'is_active'   => (bool) $item->is_active,
			'created_by'  => (int) $item->created_by,
			'created_at'  => $item->created_at,
			'updated_at'  => $item->updated_at,
		);

		return rest_ensure_response( $data );
	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Check if a given request has access to get a specific item
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool True if the request has read access for the item, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return $this->get_items_permissions_check( $request );
	}

	/**
	 * Check if a given request has access to create items
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Check if a given request has access to update a specific item
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool True if the request has access to update the item, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	/**
	 * Check if a given request has access to delete a specific item
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool True if the request has access to delete the item, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	/**
	 * Get the query params for collections
	 *
	 * @since 1.0.0
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		return array(
			'page'     => array(
				'description'       => __( 'Current page of the collection.', 'trigger' ),
				'type'              => 'integer',
				'default'           => 1,
				'sanitize_callback' => 'absint',
			),
			'per_page' => array(
				'description'       => __( 'Maximum number of items to be returned in result set.', 'trigger' ),
				'type'              => 'integer',
				'default'           => 50,
				'sanitize_callback' => 'absint',
			),
			'search'   => array(
				'description'       => __( 'Limit results to those matching a string.', 'trigger' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
			'orderby'  => array(
				'description' => __( 'Sort collection by object attribute.', 'trigger' ),
				'type'        => 'string',
				'default'     => 'created_at',
				'enum'        => array( 'id', 'name', 'created_at', 'updated_at' ),
			),
			'order'    => array(
				'description' => __( 'Order sort attribute ascending or descending.', 'trigger' ),
				'type'        => 'string',
				'default'     => 'DESC',
				'enum'        => array( 'ASC', 'DESC' ),
			),
		);
	}
}
