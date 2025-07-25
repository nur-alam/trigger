<?php
/**
 * Email Builder Service
 *
 * @package Trigger\Services\EmailBuilder
 * @subpackage Trigger\Services\EmailBuilder\EmailBuilderService
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Services\EmailBuilder;

use Trigger\Models\EmailTemplateModel;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * EmailBuilderService class for handling email builder operations
 */
class EmailBuilderService {

	/**
	 * Email template model instance
	 *
	 * @since 1.0.0
	 *
	 * @var EmailTemplateModel
	 */
	private $template_model;

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->template_model = new EmailTemplateModel();
	}

	/**
	 * Save email template
	 *
	 * @since 1.0.0
	 *
	 * @param string $name       Template name.
	 * @param array  $components Template components.
	 * @param string $description Template description.
	 * @param string $thumbnail  Template thumbnail URL.
	 * @return array Response array.
	 */
	public function save_template( $name, $components, $description = '', $thumbnail = '' ) {
		try {
			// Validate input.
			if ( empty( $name ) ) {
				return array(
					'success' => false,
					'message' => __( 'Template name is required.', 'trigger' ),
				);
			}

			if ( empty( $components ) || ! is_array( $components ) ) {
				return array(
					'success' => false,
					'message' => __( 'Template components are required.', 'trigger' ),
				);
			}

			// Prepare template data.
			$template_data = array(
				'name'        => sanitize_text_field( $name ),
				'description' => sanitize_textarea_field( $description ),
				'components'  => $components,
				'thumbnail'   => esc_url_raw( $thumbnail ),
			);

			// Save template.
			$template_id = $this->template_model->create( $template_data );

			if ( false === $template_id ) {
				return array(
					'success' => false,
					'message' => __( 'Failed to save template.', 'trigger' ),
				);
			}

			return array(
				'success'     => true,
				'message'     => __( 'Template saved successfully.', 'trigger' ),
				'template_id' => $template_id,
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => __( 'An error occurred while saving the template.', 'trigger' ),
				'error'   => $e->getMessage(),
			);
		}
	}

	/**
	 * Load email template
	 *
	 * @since 1.0.0
	 *
	 * @param int $template_id Template ID.
	 * @return array Response array.
	 */
	public function load_template( $template_id ) {
		try {
			if ( empty( $template_id ) ) {
				return array(
					'success' => false,
					'message' => __( 'Template ID is required.', 'trigger' ),
				);
			}

			$template = $this->template_model->get_by_id( absint( $template_id ) );

			if ( ! $template ) {
				return array(
					'success' => false,
					'message' => __( 'Template not found.', 'trigger' ),
				);
			}

			return array(
				'success'    => true,
				'message'    => __( 'Template loaded successfully.', 'trigger' ),
				'template'   => $template,
				'components' => $template->components,
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => __( 'An error occurred while loading the template.', 'trigger' ),
				'error'   => $e->getMessage(),
			);
		}
	}

	/**
	 * Fetch all email templates
	 *
	 * @since 1.0.0
	 *
	 * @param array $args Query arguments.
	 * @return array Response array.
	 */
	public function fetch_templates( $args = array() ) {
		try {
			$templates = $this->template_model->get_all( $args );
			$total     = $this->template_model->get_count( $args['search'] ?? '' );

			return array(
				'success'   => true,
				'message'   => __( 'Templates fetched successfully.', 'trigger' ),
				'templates' => $templates,
				'total'     => $total,
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => __( 'An error occurred while fetching templates.', 'trigger' ),
				'error'   => $e->getMessage(),
			);
		}
	}

	/**
	 * Delete email template
	 *
	 * @since 1.0.0
	 *
	 * @param int $template_id Template ID.
	 * @return array Response array.
	 */
	public function delete_template( $template_id ) {
		try {
			if ( empty( $template_id ) ) {
				return array(
					'success' => false,
					'message' => __( 'Template ID is required.', 'trigger' ),
				);
			}

			$result = $this->template_model->delete( absint( $template_id ) );

			if ( ! $result ) {
				return array(
					'success' => false,
					'message' => __( 'Failed to delete template.', 'trigger' ),
				);
			}

			return array(
				'success' => true,
				'message' => __( 'Template deleted successfully.', 'trigger' ),
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => __( 'An error occurred while deleting the template.', 'trigger' ),
				'error'   => $e->getMessage(),
			);
		}
	}

	/**
	 * Duplicate email template
	 *
	 * @since 1.0.0
	 *
	 * @param int    $template_id Template ID.
	 * @param string $new_name    New template name.
	 * @return array Response array.
	 */
	public function duplicate_template( $template_id, $new_name = '' ) {
		try {
			if ( empty( $template_id ) ) {
				return array(
					'success' => false,
					'message' => __( 'Template ID is required.', 'trigger' ),
				);
			}

			$new_template_id = $this->template_model->duplicate( absint( $template_id ), $new_name );

			if ( false === $new_template_id ) {
				return array(
					'success' => false,
					'message' => __( 'Failed to duplicate template.', 'trigger' ),
				);
			}

			return array(
				'success'     => true,
				'message'     => __( 'Template duplicated successfully.', 'trigger' ),
				'template_id' => $new_template_id,
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => __( 'An error occurred while duplicating the template.', 'trigger' ),
				'error'   => $e->getMessage(),
			);
		}
	}

	/**
	 * Update email template
	 *
	 * @since 1.0.0
	 *
	 * @param int   $template_id Template ID.
	 * @param array $data        Template data.
	 * @return array Response array.
	 */
	public function update_template( $template_id, $data ) {
		try {
			if ( empty( $template_id ) ) {
				return array(
					'success' => false,
					'message' => __( 'Template ID is required.', 'trigger' ),
				);
			}

			$result = $this->template_model->update( absint( $template_id ), $data );

			if ( ! $result ) {
				return array(
					'success' => false,
					'message' => __( 'Failed to update template.', 'trigger' ),
				);
			}

			return array(
				'success' => true,
				'message' => __( 'Template updated successfully.', 'trigger' ),
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => __( 'An error occurred while updating the template.', 'trigger' ),
				'error'   => $e->getMessage(),
			);
		}
	}
}