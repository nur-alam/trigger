<?php

namespace Trigger\Helpers;

class CursorValidationHelper {
	protected $data           = array();
	protected $rules          = array();
	protected $messages       = array();
	protected $errors         = array();
	protected $customMessages = array();

	public function __construct( array $data, array $rules, array $messages = array() ) {
		$this->data           = $data;
		$this->rules          = $rules;
		$this->customMessages = $messages;
	}

	public function validate() {
		$this->errors = array();

		foreach ( $this->rules as $field => $rules ) {
			$rules = is_string( $rules ) ? explode( '|', $rules ) : $rules;

			foreach ( $rules as $rule ) {
				$parameters = array();

				if ( is_string( $rule ) ) {
					if ( strpos( $rule, ':' ) !== false ) {
						list($rule, $parameter) = explode( ':', $rule, 2 );
						$parameters             = explode( ',', $parameter );
					}
				}

				$method = 'validate' . ucfirst( $rule );

				if ( method_exists( $this, $method ) ) {
					$value = isset( $this->data[ $field ] ) ? $this->data[ $field ] : null;

					if ( ! $this->$method( $field, $value, $parameters ) ) {
						$this->addError( $field, $rule, $parameters );
					}
				}
			}
		}

		return empty( $this->errors );
	}

	protected function validateRequired( $field, $value ) {
		return ! empty( $value );
	}

	protected function validateEmail( $field, $value ) {
		return empty( $value ) || filter_var( $value, FILTER_VALIDATE_EMAIL );
	}

	protected function validateNumeric( $field, $value ) {
		return empty( $value ) || is_numeric( $value );
	}

	protected function validateMin( $field, $value, $parameters ) {
		$min = $parameters[0];
		return strlen( $value ) >= $min;
	}

	protected function validateMax( $field, $value, $parameters ) {
		$max = $parameters[0];
		return strlen( $value ) <= $max;
	}

	protected function validateIn( $field, $value, $parameters ) {
		return in_array( $value, $parameters );
	}

	protected function validateRegex( $field, $value, $parameters ) {
		return empty( $value ) || preg_match( $parameters[0], $value );
	}

	protected function addError( $field, $rule, $parameters = array() ) {
		$message                  = $this->getErrorMessage( $field, $rule, $parameters );
		$this->errors[ $field ][] = $message;
	}

	protected function getErrorMessage( $field, $rule, $parameters ) {
		$key = "{$field}.{$rule}";

		if ( isset( $this->customMessages[ $key ] ) ) {
			return $this->customMessages[ $key ];
		}

		// Default messages
		$messages = array(
			'required' => '%s is required',
			'email'    => '%s must be a valid email address',
			'numeric'  => '%s must be a number',
			'min'      => '%s must be at least %d characters',
			'max'      => '%s must not exceed %d characters',
			'in'       => '%s must be one of: %s',
			'regex'    => '%s format is invalid',
		);

		$message = isset( $messages[ $rule ] ) ? $messages[ $rule ] : '%s is invalid';

		// Format message with field name and parameters
		$params = array_merge(
			array( ucfirst( str_replace( '_', ' ', $field ) ) ),
			$parameters
		);

		return vsprintf( $message, $params );
	}

	public function getErrors() {
		return $this->errors;
	}

	public function hasErrors() {
		return ! empty( $this->errors );
	}
}
