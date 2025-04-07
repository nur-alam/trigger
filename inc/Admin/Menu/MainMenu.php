<?php
/**
 * Register admin main menu & sub-menu
 *
 * @package Trigger\Admin\Menu
 * @subpackage Trigger\Admin\Menu\MainMenu
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Admin\Menu;

use Trigger;
use Trigger\Admin\Menu\SubMenu\Settings;
use Trigger\Admin\Menu\SubMenu\EmailLogs;
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Admin main menu & sub-menu management
 */
class MainMenu {

	/**
	 * Capability
	 *
	 * @var string
	 */
	private $capability = 'manage_options';

	/**
	 * Slug for this page
	 *
	 * @var string $slug
	 */
	private $slug = 'trigger';

	/**
	 * Hold plugin meta data
	 *
	 * @var array
	 */
	public $plugin_data;

	/**
	 * Register hooks
	 *
	 * @param bool $run  to excecute contrustor method.
	 *
	 * @return void
	 */
	public function __construct( $run = true ) {
		if ( $run ) {
			add_action( 'admin_menu', array( $this, 'add_menu' ) );
		}
		$this->plugin_data = Trigger::plugin_data();
	}

	/**
	 * Page title
	 *
	 * @return string
	 */
	public function page_title(): string {
		return __( 'Trigger', 'trigger' );
	}

	/**
	 * Menu title
	 *
	 * @return string
	 */
	public function menu_title(): string {
		return __( 'Trigger', 'trigger' );
	}

	/**
	 * Capability
	 *
	 * @return string
	 */
	public function capability(): string {
		return $this->capability;
	}

	/**
	 * Slug
	 *
	 * @return string
	 */
	public function slug(): string {
		return $this->slug;
	}

	/**
	 * Position
	 *
	 * @return int
	 */
	public function position(): int {
		return 2;
	}

	/**
	 * Icon name that will used for page menu icon
	 *
	 * @return string
	 */
	public function icon_name(): string {
		return '';
	}

	/**
	 * Main menu register
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function add_menu() {

		// Register main menu.
		add_menu_page(
			$this->slug(),
			$this->menu_title(),
			$this->capability(),
			$this->slug(),
			array( $this, 'view' ),
			$this->icon_name(),
			$this->position()
		);

		// Register main menu.
		add_submenu_page(
			$this->slug(),
			'Dashboard',
			'Dashboard',
			$this->capability(),
			$this->slug(),
			array( $this, 'view' )
		);

		// $submenus = $this->submenu_factory();

		$email_logs_submenu = new EmailLogs();
		add_submenu_page(
			$this->slug(),
			$email_logs_submenu->page_title(),
			$email_logs_submenu->menu_title(),
			$email_logs_submenu->capability(),
			$email_logs_submenu->slug(),
			array( $this, 'view' )
		);

		// Register sub-menus.
		$settings_submenu = new Settings();
		add_submenu_page(
			$this->slug(),
			$settings_submenu->page_title(),
			$settings_submenu->menu_title(),
			$settings_submenu->capability(),
			$settings_submenu->slug(),
			array( $this, 'view' )
		);
	}

	/**
	 * The function creates an array of submenu objects for a menu.
	 *
	 * @since 1.0.0
	 *
	 * @return The function `submenu_factory()` is returning an array of objects that represent sub-menus.
	 * The sub-menus are instances of the `Packages`, `Products`, and `Orders` classes.
	 */
	private function submenu_factory() {
		$submenus = array(
			new Settings(),
		);

		return $submenus;
	}

	/**
	 * Page view
	 *
	 * @return void
	 */
	public function view() {
		include trailingslashit( $this->plugin_data['views'] . 'pages' ) . 'trigger-view.php';
	}

	/**
	 * Page view
	 *
	 * @return void
	 */
	public function word_view() {
		include trailingslashit( $this->plugin_data['views'] . 'pages' ) . 'settings-view.php';
	}
}
