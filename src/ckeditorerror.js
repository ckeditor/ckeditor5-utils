/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module utils/ckeditorerror
 */

/**
 * The CKEditor error class.
 *
 * All errors will be shortened during the minification process in order to reduce the code size.
 * Therefore, all error messages should be documented in the same way as those in {@link module:utils/log}.
 *
 * Read more in the {@link module:utils/log} module.
 * @extends Error
 */
export default class CKEditorError extends Error {
	/**
	 * Creates an instance of the CKEditorError class.
	 *
	 * Read more about error logging in the {@link module:utils/log} module.
	 *
	 * @param {String} message The error message in an `error-name: Error message.` format.
	 * During the minification process the "Error message" part will be removed to limit the code size
	 * and a link to this error documentation will be added to the `message`.
	 * @param {Object} [data] Additional data describing the error. A stringified version of this object
	 * will be appended to the error {@link #message}, so the data are quickly visible in the console. The original
	 * data object will also be later available under the {@link #data} property.
	 */
	constructor( message, data ) {
		if ( data ) {
			message += ' ' + JSON.stringify( data );
		}

		super( message );

		/**
		 * @member {String} name
		 */
		this.name = 'CKEditorError';

		/**
		 * The additional error data passed to the constructor.
		 *
		 * @member {Object} data
		 */
		this.data = data;
	}

	/**
	 * Checks if error is an instance of CKEditorError class.
	 *
	 * @param {Object} error Object to check.
	 * @returns {Boolean}
	 */
	static isCKEditorError( error ) {
		return error instanceof CKEditorError;
	}
}
