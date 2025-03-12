<?php
/**
 * Enqueue Assets, styles & scripts
 *
 * @package Trigger\Models
 * @subpackage Trigger\Models\WordsModel
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Models;

use Trigger\Database\WordTable;
use Trigger\Helpers\QueryHelper;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Words database operation management
 */
class WordsModel {

	/**
	 * Table name
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $table_name;

	/**
	 * Resolve dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->table_name = ( new WordTable() )->get_table_name();
	}

	/**
	 * Get_words from word table.
	 *
	 * @param array $data field as per database table.
	 *
	 * @return array
	 */
	public function get_words( $data ) {
		global $wpdb;
		$order      = $data['order'];
		$query      = $wpdb->prepare( "SELECT COUNT(*) FROM $this->table_name" );
		$word_count = $wpdb->get_var( $query ); //phpcs:ignore
		if ( ! $data['search'] ) {
			$query  = $wpdb->prepare(
				"SELECT * FROM $this->table_name 
					ORDER BY id $order LIMIT %d OFFSET %d",
				$data['limit'],
				$data['offset']
			);
			$result = $wpdb->get_results( $query ); //phpcs:ignore
		} else {
			$like   = '%' . $data['search'] . '%';
			$query  = $wpdb->prepare(
				"SELECT * FROM $this->table_name 
					WHERE word LIKE %s LIMIT %d OFFSET %d",
				$like,
				$data['limit'],
				$data['offset']
			);
			$result = $wpdb->get_results( $query ); //phpcs:ignore
			return array(
				'count'   => (int) count( $result ),
				'results' => $result,
			);
		}
		return array(
			'count'   => (int) $word_count,
			'results' => $result,
		);
	}

	/**
	 * Create_word in words table.
	 *
	 * @param array $data field as per database table.
	 *
	 * @return integer
	 */
	public function create_word( $data ) {
		global $wpdb;
		try {
			$insert = $wpdb->insert(
				$this->table_name,
				$data
			);
		} catch ( \Throwable $th ) {
			return wp_send_json_error( $th );
		}

		return $insert;
	}

	/**
	 * Create_bookmark in words table.
	 *
	 * @param array $data field as per database table.
	 *
	 * @return integer
	 */
	public function create_bookmark( $data ) {
		global $wpdb;

		$insert = $wpdb->insert(
			$this->table_name,
			$data
		);

		return $insert;
	}

	/**
	 * Update_word in words table.
	 *
	 * @param array $data field as per database table.
	 *
	 * @return integer
	 */
	public function update_word( $data ) {
		global $wpdb;
		try {
			$update = $wpdb->update(
				$this->table_name,
				$data,
				array( 'id' => $data['id'] )
			);
		} catch ( \Throwable $th ) {
			return wp_send_json_error( $th );
		}

		return $update;
	}

	/**
	 * Update_word in words table.
	 *
	 * @param array $word field as per database table.
	 *
	 * @return integer
	 */
	public function delete_word( $word ) {
		global $wpdb;
		try {
			$deleted = $wpdb->delete(
				$this->table_name,
				array( 'id' => $word['id'] )
			);
		} catch ( \Throwable $th ) {
			return wp_send_json_error( $th );
		}

		return $deleted;
	}
}
