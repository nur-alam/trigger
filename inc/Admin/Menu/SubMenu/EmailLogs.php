<?php
/**
 * EmailLogs sub menu
 *
 * @package Trigger\Admin\Menu\SubMenu
 * @subpackage Trigger\Admin\Menu\SubMenu\EmailLogs
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Admin\Menu\SubMenu;

/**
 * EmailLogs sub menu
 */
class EmailLogs implements SubMenuInterface {

	/**
	 * Page title
	 *
	 * @since 1.0.0
	 *
	 * @return string  page title
	 */
	public function page_title(): string {
		return __( 'Email Logs', 'triggermail' );
	}

	/**
	 * Menu title
	 *
	 * @since 1.0.0
	 *
	 * @return string  menu title
	 */
	public function menu_title(): string {
		return __( 'Email Logs', 'triggermail' );
	}

	/**
	 * Page title
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function page_view(): string {
		return __( 'email-logs-view', 'triggermail' );
	}

	/**
	 * Capability to access this menu
	 *
	 * @since 1.0.0
	 *
	 * @return string  capability
	 */
	public function capability(): string {
		return 'manage_options';
	}

	/**
	 * Page URL slug
	 *
	 * @since 1.0.0
	 *
	 * @return string  slug
	 */
	public function slug(): string {
		return 'trigger-email-logs';
	}

	/**
	 * Render content for this sub-menu page
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function callback() {}
}
