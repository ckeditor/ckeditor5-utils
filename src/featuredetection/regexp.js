/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module utils/featuredetection/regexp
 */

/**
 * Holds feature detection related to regular expressions used by the editor.
 *
 * @protected
 * @namespace
 */
export default {
	/**
	 * Indicates whether the current browser supports ES2018 Unicode properties like `\p{P}` or `\p{L}`.
	 * More information about unicode properties might be found [here](https://www.unicode.org/reports/tr44/#GC_Values_Table).
	 *
	 * @type {Boolean}
	 */
	isUnicodePropertySupported: ( function() {
		let isSupported = false;

		// Feature detection for Unicode properties. Added in ES2018. Currently Firefox and Edge do not support it.
		// See https://github.com/ckeditor/ckeditor5-mention/issues/44#issuecomment-487002174.

		try {
			isSupported = 'ć'.search( new RegExp( '[\\p{L}]', 'u' ) ) === 0; // Usage of regular expression literal cause error during build
		} catch ( error ) {
			// Firefox throws a SyntaxError when the group is unsupported.
		}

		return isSupported;
	}() )
};
