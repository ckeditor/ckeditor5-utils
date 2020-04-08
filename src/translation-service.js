/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals window */

/**
 * @module utils/translation-service
 */

/* istanbul ignore else */
if ( !window.CKEDITOR_TRANSLATIONS ) {
	window.CKEDITOR_TRANSLATIONS = {};
}

/**
 * Adds translations to existing ones.
 * These translations will later be available for the {@link module:utils/translation-service~translate `translate()`} function.
 *
 *		add( 'pl', {
 *			'OK': 'OK',
 *			'Cancel [context: reject]': 'Anuluj'
 *		} );
 *
 * If you cannot import this function from this module (e.g. because you use a CKEditor 5 build), then you can
 * still add translations by extending the global `window.CKEDITOR_TRANSLATIONS` object by using a function like
 * the one below:
 *
 *		function addTranslations( language, translations ) {
 *			if ( !window.CKEDITOR_TRANSLATIONS ) {
 *				window.CKEDITOR_TRANSLATIONS = {};
 *			}
 *
 *			const dictionary = window.CKEDITOR_TRANSLATIONS[ language ] || ( window.CKEDITOR_TRANSLATIONS[ language ] = {} );
 *
 *			// Extend the dictionary for the given language.
 *			Object.assign( dictionary, translations );
 *		}
 *
 * @param {String} language Target language.
 * @param {Object.<String, String>} translations Translations which will be added to the dictionary.
 * @param {Function} getFormIndex
 */
export function add( language, translations, getFormIndex ) {
	const languageTranslations = window.CKEDITOR_TRANSLATIONS[ language ] || ( window.CKEDITOR_TRANSLATIONS[ language ] = {} );

	languageTranslations.dictionary = languageTranslations.dictionary || {};
	languageTranslations.getFormIndex = getFormIndex || languageTranslations.getFormIndex || ( () => 0 );

	Object.assign( languageTranslations.dictionary, translations );
}

/**
 * Translates string if the translation of the string was previously added to the dictionary.
 * See {@link module:utils/translation-service Translation Service}.
 * This happens in a multi-language mode were translation modules are created by the bundler.
 *
 * When no translation is defined in the dictionary or the dictionary doesn't exist this function returns
 * the original string without the `'[context: ]'` (happens in development and single-language modes).
 *
 * In a single-language mode (when values passed to `t()` were replaced with target language strings) the dictionary
 * is left empty, so this function will return the original strings always.
 *
 *		translate( 'pl', 'Cancel [context: reject]' );
 *
 * @param {String} language Target language.
 * @param {Object} message A message that will be translated.
 * @param {Number} amount
 * @returns {String} Translated sentence.
 */
export function translate( language, message, amount ) {
	const numberOfLanguages = getNumberOfLanguages();

	if ( numberOfLanguages === 1 ) {
		// Override the language to the only supported one.
		// This can't be done in the `Locale` class, because the translations comes after the `Locale` class initialization.
		language = Object.keys( window.CKEDITOR_TRANSLATIONS )[ 0 ];
	}

	const messageId = message.id || message.string;

	if ( numberOfLanguages === 0 || !hasTranslation( language, messageId ) ) {
		// return english forms:
		if ( amount !== 1 ) {
			return message.plural;
		}

		return message.string;
	}

	const dictionary = window.CKEDITOR_TRANSLATIONS[ language ].dictionary;
	const getFormIndex = window.CKEDITOR_TRANSLATIONS[ language ].getFormIndex;

	// TODO - maybe a warning could be helpful for some mismatches.

	if ( typeof dictionary[ messageId ] === 'string' ) {
		return dictionary[ messageId ];
	}

	// Note: The `translate` function is not responsible for replacing `%0, %1, ...` with values.
	return dictionary[ messageId ][ getFormIndex( amount ) ];
}

/**
 * Clears dictionaries for test purposes.
 *
 * @protected
 */
export function _clear() {
	window.CKEDITOR_TRANSLATIONS = {};
}

// Checks whether the dictionary exists and translation in that dictionary exists.
function hasTranslation( language, messageId ) {
	return (
		window.CKEDITOR_TRANSLATIONS[ language ] &&
		window.CKEDITOR_TRANSLATIONS[ language ].dictionary[ messageId ]
	);
}

function getNumberOfLanguages() {
	return Object.keys( window.CKEDITOR_TRANSLATIONS ).length;
}
