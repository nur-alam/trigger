<?php
/**
 * Interface contains  method that derived class must need to implement
 *
 * @package Trigger\Admin\Menu\SubMenu;
 * @subpackage Trigger\Admin\Menu\SubMenu\SubMenuInterface;
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Admin\Menu\SubMenu;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 *  SubMenuInterface
 */
interface SubMenuInterface {

	/**
	 * Page title
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function page_title(): string;

	/**
	 * Menu title
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function menu_title(): string;

	/**
	 * Page title
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function page_view(): string;

	/**
	 * User capability
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function capability(): string;

	/**
	 * Page slug
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function slug(): string;

	/**
	 * Sub menu callback function
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function callback();
}
