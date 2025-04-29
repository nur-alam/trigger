<?php
/**
 * Initialize plugin constants
 *
 * @package Trigger\Core
 * @author  Trigger<trigger@gmail.com>
 * @since 1.0.0
 */

define( 'TRIGGER_VERSION', '1.0.0' );
define( 'TRIGGER_PLUGIN_NAME', 'triggermail' );
define( 'TRIGGER_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'TRIGGER_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'TRIGGER_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
define( 'TRIGGER_DEFAULT_EMAIL_PROVIDER', 'trigger_default_email_provider' ); // default email provider array
define( 'TRIGGER_EMAIL_CONFIG', 'trigger_email_config' ); // array of email providers
define( 'TRIGGER_LOG_RETENTION', 'trigger_log_retention' ); // log retention
define( 'TRIGGER_LOG_RETENTION_DEFAULT', 30 ); // log retention default
