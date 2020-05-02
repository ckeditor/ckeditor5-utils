/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module utils/dom/getancestorwithoverflow
 */

import global from './global';

/**
 * For a given element, returns the nearest ancestor element which CSS `overflow` is not `visible`.
 *
 * @param {HTMLElement} element The native DOM element to be checked.
 * @returns {HTMLElement|null}
 */
export default function getAncestorWithOveflow( element ) {
	while ( element && element.tagName.toLowerCase() != 'html' ) {
		if ( global.window.getComputedStyle( element ).overflow != 'visible' ) {
			return element;
		}

		element = element.parentElement;
	}

	return null;
}

