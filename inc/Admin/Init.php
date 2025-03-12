<?php
/**
 * Admin module loader
 *
 * @package Trigger\Admin
 * @subpackage Trigger\Admin\Init
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Admin;

use Trigger\Admin\Menu\MainMenu;

/**
 * Admin Package loader
 *
 * @since 1.0.0
 */
class Init {

	/**
	 * Load dependencies
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		new MainMenu();
	}
}
