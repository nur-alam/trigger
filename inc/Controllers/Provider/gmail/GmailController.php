<?php
/**
 * Google Mail Implementation
 *
 * @package Trigger\Core
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

namespace Trigger\Controllers\Provider\gmail;

use Trigger\Traits\JsonResponse;

/**
 * GoogleMailer class
 */
class GmailController {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'wp_ajax_trigger_connect_with_gmail', array( $this, 'gmail_mailer_authentication' ) );
	}

	/**
	 * Page content for the Gmail Mailer Manual page
	 */
	public function gmail_mailer_authentication() {
		$gmailer = new GMailer();
		$gmailer->gmail_mailer_authentication();
	}
}
