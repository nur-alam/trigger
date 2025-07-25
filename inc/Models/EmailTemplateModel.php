<?php
/**
 * Email Template Model
 *
 * @package Trigger\Models
 * @subpackage Trigger\Models\EmailTemplateModel
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Models;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * EmailTemplateModel class for handling email template data operations
 */
class EmailTemplateModel {

	/**
	 * Table name
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $table_name;

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		global $wpdb;
		$this->table_name = $wpdb->prefix . 'trigger_email_templates';
	}

	/**
	 * Create a new email template
	 *
	 * @since 1.0.0
	 *
	 * @param array $data Template data.
	 * @return int|false Template ID on success, false on failure.
	 */
	public function create( $data ) {
		global $wpdb;

		$defaults = array(
			'name'        => '',
			'description' => '',
			'components'  => '',
			'thumbnail'   => '',
			'is_active'   => 1,
			'created_by'  => get_current_user_id(),
			'created_at'  => current_time( 'mysql' ),
			'updated_at'  => current_time( 'mysql' ),
		);

		$data = wp_parse_args( $data, $defaults );

		// Validate required fields.
		if ( empty( $data['name'] ) || empty( $data['components'] ) ) {
			return false;
		}

		// Sanitize data.
		$data['name']        = sanitize_text_field( $data['name'] );
		$data['description'] = sanitize_textarea_field( $data['description'] );
		$data['components']  = wp_json_encode( $data['components'] );
		$data['thumbnail']   = esc_url_raw( $data['thumbnail'] );

		$result = $wpdb->insert(
			$this->table_name,
			$data,
			array(
				'%s', // name
				'%s', // description
				'%s', // components
				'%s', // thumbnail
				'%d', // is_active
				'%d', // created_by
				'%s', // created_at
				'%s', // updated_at
			)
		);

		return $result ? $wpdb->insert_id : false;
	}

	/**
	 * Get a template by ID
	 *
	 * @since 1.0.0
	 *
	 * @param int $id Template ID.
	 * @return object|null Template object or null if not found.
	 */
	public function get_by_id( $id ) {
		global $wpdb;

		$query = $wpdb->prepare(
			"SELECT * FROM `{$wpdb->prefix}trigger_email_templates` WHERE id = %d AND is_active = 1",
			$id
		);

		$template = $wpdb->get_row( $query );

		if ( $template ) {
			$template->components = json_decode( $template->components, true );
		}

		return $template;
	}

	/**
	 * Get all templates
	 *
	 * @since 1.0.0
	 *
	 * @param array $args Query arguments.
	 * @return array Array of template objects.
	 */
	public function get_all( $args = array() ) {
		global $wpdb;

		$defaults = array(
			'limit'   => 50,
			'offset'  => 0,
			'orderby' => 'created_at',
			'order'   => 'DESC',
			'search'  => '',
		);

		$args = wp_parse_args( $args, $defaults );

		$where = 'WHERE is_active = 1';

		if ( ! empty( $args['search'] ) ) {
			$search = '%' . $wpdb->esc_like( $args['search'] ) . '%';
			$where .= $wpdb->prepare( ' AND name LIKE %s', $search );
		}

		$orderby = sanitize_sql_orderby( $args['orderby'] . ' ' . $args['order'] );
		$limit   = absint( $args['limit'] );
		$offset  = absint( $args['offset'] );

		$query = "SELECT * FROM {$this->table_name} {$where} ORDER BY {$orderby} LIMIT {$limit} OFFSET {$offset}";

		$templates = $wpdb->get_results( $query );

		foreach ( $templates as $template ) {
			$template->components = json_decode( $template->components, true );
		}

		return $templates;
	}

	/**
	 * Update a template
	 *
	 * @since 1.0.0
	 *
	 * @param int   $id   Template ID.
	 * @param array $data Template data.
	 * @return bool True on success, false on failure.
	 */
	public function update( $id, $data ) {
		global $wpdb;

		// Remove fields that shouldn't be updated.
		unset( $data['id'], $data['created_at'], $data['created_by'] );

		$data['updated_at'] = current_time( 'mysql' );

		// Sanitize data.
		if ( isset( $data['name'] ) ) {
			$data['name'] = sanitize_text_field( $data['name'] );
		}
		if ( isset( $data['description'] ) ) {
			$data['description'] = sanitize_textarea_field( $data['description'] );
		}
		if ( isset( $data['components'] ) ) {
			$data['components'] = wp_json_encode( $data['components'] );
		}
		if ( isset( $data['thumbnail'] ) ) {
			$data['thumbnail'] = esc_url_raw( $data['thumbnail'] );
		}

		$result = $wpdb->update(
			$this->table_name,
			$data,
			array( 'id' => $id ),
			array(
				'%s', // name
				'%s', // description
				'%s', // components
				'%s', // thumbnail
				'%d', // is_active
				'%s', // updated_at
			),
			array( '%d' )
		);

		return $result !== false;
	}

	/**
	 * Delete a template (soft delete)
	 *
	 * @since 1.0.0
	 *
	 * @param int $id Template ID.
	 * @return bool True on success, false on failure.
	 */
	public function delete( $id ) {
		global $wpdb;

		$result = $wpdb->update(
			$this->table_name,
			array(
				'is_active'  => 0,
				'updated_at' => current_time( 'mysql' ),
			),
			array( 'id' => $id ),
			array( '%d', '%s' ),
			array( '%d' )
		);

		return $result !== false;
	}

	/**
	 * Get template count
	 *
	 * @since 1.0.0
	 *
	 * @param string $search Search term.
	 * @return int Template count.
	 */
	public function get_count( $search = '' ) {
		global $wpdb;

		$where = 'WHERE is_active = 1';

		if ( ! empty( $search ) ) {
			$search = '%' . $wpdb->esc_like( $search ) . '%';
			$where .= $wpdb->prepare( ' AND name LIKE %s', $search );
		}

		$count = $wpdb->get_var( "SELECT COUNT(*) FROM {$this->table_name} {$where}" );

		return absint( $count );
	}

	/**
	 * Duplicate a template
	 *
	 * @since 1.0.0
	 *
	 * @param int    $id   Template ID to duplicate.
	 * @param string $name New template name.
	 * @return int|false New template ID on success, false on failure.
	 */
	public function duplicate( $id, $name = '' ) {
		$template = $this->get_by_id( $id );

		if ( ! $template ) {
			return false;
		}

		$new_name = ! empty( $name ) ? $name : $template->name . ' (Copy)';

		$new_data = array(
			'name'        => $new_name,
			'description' => $template->description,
			'components'  => $template->components,
			'thumbnail'   => $template->thumbnail,
		);

		return $this->create( $new_data );
	}
}