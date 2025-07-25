<?php
/**
 * Email Template Utility
 *
 * @package Trigger\Services\EmailBuilder
 * @subpackage Trigger\Services\EmailBuilder\EmailTemplateUtility
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Services\EmailBuilder;

use Trigger\Services\EmailBuilder\EmailTemplateTable;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * EmailTemplateUtility class for utility functions
 */
class EmailTemplateUtility {

	/**
	 * Validate template data
	 *
	 * @since 1.0.0
	 *
	 * @param array $data Template data to validate.
	 * @return array Validation result with success status and errors.
	 */
	public static function validate_template_data( $data ) {
		$errors = array();

		// Validate name.
		if ( empty( $data['name'] ) ) {
			$errors[] = __( 'Template name is required.', 'trigger' );
		} elseif ( strlen( $data['name'] ) > 255 ) {
			$errors[] = __( 'Template name must be less than 255 characters.', 'trigger' );
		}

		// Validate components.
		if ( empty( $data['components'] ) ) {
			$errors[] = __( 'Template components are required.', 'trigger' );
		} elseif ( ! is_string( $data['components'] ) && ! is_array( $data['components'] ) ) {
			$errors[] = __( 'Template components must be a valid JSON string or array.', 'trigger' );
		}

		// Validate description.
		if ( isset( $data['description'] ) && strlen( $data['description'] ) > 1000 ) {
			$errors[] = __( 'Template description must be less than 1000 characters.', 'trigger' );
		}

		// Validate thumbnail.
		if ( isset( $data['thumbnail'] ) && ! empty( $data['thumbnail'] ) ) {
			if ( ! filter_var( $data['thumbnail'], FILTER_VALIDATE_URL ) ) {
				$errors[] = __( 'Template thumbnail must be a valid URL.', 'trigger' );
			}
		}

		return array(
			'success' => empty( $errors ),
			'errors'  => $errors,
		);
	}

	/**
	 * Sanitize template data
	 *
	 * @since 1.0.0
	 *
	 * @param array $data Template data to sanitize.
	 * @return array Sanitized template data.
	 */
	public static function sanitize_template_data( $data ) {
		$sanitized = array();

		// Sanitize name.
		if ( isset( $data['name'] ) ) {
			$sanitized['name'] = sanitize_text_field( $data['name'] );
		}

		// Sanitize description.
		if ( isset( $data['description'] ) ) {
			$sanitized['description'] = sanitize_textarea_field( $data['description'] );
		}

		// Sanitize components.
		if ( isset( $data['components'] ) ) {
			if ( is_string( $data['components'] ) ) {
				// Validate JSON.
				$decoded = json_decode( $data['components'], true );
				if ( json_last_error() === JSON_ERROR_NONE ) {
					$sanitized['components'] = wp_json_encode( $decoded );
				} else {
					$sanitized['components'] = '';
				}
			} elseif ( is_array( $data['components'] ) ) {
				$sanitized['components'] = wp_json_encode( $data['components'] );
			}
		}

		// Sanitize thumbnail.
		if ( isset( $data['thumbnail'] ) ) {
			$sanitized['thumbnail'] = esc_url_raw( $data['thumbnail'] );
		}

		return $sanitized;
	}

	/**
	 * Generate unique template name
	 *
	 * @since 1.0.0
	 *
	 * @param string $base_name Base name for the template.
	 * @param int    $exclude_id Template ID to exclude from check.
	 * @return string Unique template name.
	 */
	public static function generate_unique_name( $base_name, $exclude_id = 0 ) {
		global $wpdb;

		$table_name = EmailTemplateTable::get_table_name();
		$name       = $base_name;
		$counter    = 1;

		while ( true ) {
			$count = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM `{$wpdb->prefix}email_templates` WHERE name = %s AND id != %d AND is_active = 1",
					$name,
					$exclude_id
				)
			);

			if ( 0 === (int) $count ) {
				break;
			}

			$name = $base_name . ' (' . $counter . ')';
			$counter++;
		}

		return $name;
	}

	/**
	 * Format template for response
	 *
	 * @since 1.0.0
	 *
	 * @param object $template Template object from database.
	 * @return array Formatted template data.
	 */
	public static function format_template_response( $template ) {
		if ( ! $template ) {
			return null;
		}

		return array(
			'id'          => (int) $template->id,
			'name'        => $template->name,
			'description' => $template->description,
			'components'  => json_decode( $template->components, true ),
			'thumbnail'   => $template->thumbnail,
			'is_active'   => (bool) $template->is_active,
			'created_by'  => (int) $template->created_by,
			'created_at'  => $template->created_at,
			'updated_at'  => $template->updated_at,
		);
	}

	/**
	 * Format templates list for response
	 *
	 * @since 1.0.0
	 *
	 * @param array $templates Array of template objects from database.
	 * @return array Formatted templates data.
	 */
	public static function format_templates_response( $templates ) {
		if ( empty( $templates ) ) {
			return array();
		}

		$formatted = array();
		foreach ( $templates as $template ) {
			$formatted[] = self::format_template_response( $template );
		}

		return $formatted;
	}

	/**
	 * Generate template thumbnail from components
	 *
	 * @since 1.0.0
	 *
	 * @param string $components Template components JSON.
	 * @return string Generated thumbnail URL or empty string.
	 */
	public static function generate_thumbnail( $components ) {
		// This is a placeholder for thumbnail generation logic.
		// You can implement actual thumbnail generation here.
		// For now, return a default placeholder.
		return '';
	}

	/**
	 * Check if user can manage templates
	 *
	 * @since 1.0.0
	 *
	 * @param int $user_id User ID to check. Defaults to current user.
	 * @return bool True if user can manage templates, false otherwise.
	 */
	public static function user_can_manage_templates( $user_id = 0 ) {
		if ( 0 === $user_id ) {
			$user_id = get_current_user_id();
		}

		// Check if user has manage_options capability.
		return user_can( $user_id, 'manage_options' );
	}

	/**
	 * Log template activity
	 *
	 * @since 1.0.0
	 *
	 * @param string $action Action performed (create, update, delete, etc.).
	 * @param int    $template_id Template ID.
	 * @param array  $data Additional data to log.
	 * @return void
	 */
	public static function log_activity( $action, $template_id, $data = array() ) {
		// This is a placeholder for activity logging.
		// You can implement actual logging here if needed.
		$log_data = array(
			'action'      => $action,
			'template_id' => $template_id,
			'user_id'     => get_current_user_id(),
			'timestamp'   => current_time( 'mysql' ),
			'data'        => $data,
		);

		// Log to WordPress debug log if WP_DEBUG is enabled.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'Email Template Activity: ' . wp_json_encode( $log_data ) );
		}
	}
}