/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module utils/locale
 */

/* globals console */

import { translate } from './translation-service';

const RTL_LANGUAGE_CODES = [ 'ar', 'fa', 'he', 'ku', 'ug' ];

/**
 * Represents the localization services.
 */
export default class Locale {
	/**
	 * Creates a new instance of the Locale class. Learn more about
	 * {@glink features/ui-language configuring language of the editor}.
	 *
	 * @param {Object} [options] Locale configuration.
	 * @param {String} [options.uiLanguage='en'] The editor UI language code in the
	 * [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format. See {@link #uiLanguage}.
	 * @param {String} [options.contentLanguage] The editor content language code in the
	 * [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format. If not specified, the same as `options.language`.
	 * See {@link #contentLanguage}.
	 */
	constructor( options = {} ) {
		/**
		 * The editor UI language code in the [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format.
		 *
		 * If the {@link #contentLanguage content language} was not specified in the `Locale` constructor,
		 * it also defines the language of the content.
		 *
		 * @readonly
		 * @member {String}
		 */
		this.uiLanguage = options.uiLanguage || 'en';

		/**
		 * The editor content language code in the [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format.
		 *
		 * Usually the same as {@link #uiLanguage editor language}, it can be customized by passing an optional
		 * argument to the `Locale` constructor.
		 *
		 * @readonly
		 * @member {String}
		 */
		this.contentLanguage = options.contentLanguage || this.uiLanguage;

		/**
		 * Text direction of the {@link #uiLanguage editor UI language}. Either `'ltr'` or `'rtl'`.
		 *
		 * @readonly
		 * @member {String}
		 */
		this.uiLanguageDirection = getLanguageDirection( this.uiLanguage );

		/**
		 * Text direction of the {@link #contentLanguage editor content language}.
		 *
		 * If the content language was passed directly to the `Locale` constructor, this property represents the
		 * direction of that language.
		 *
		 * If the {@link #contentLanguage editor content language} was derived from the {@link #uiLanguage editor language},
		 * the content language direction is the same as the {@link #uiLanguageDirection UI language direction}.
		 *
		 * The value is either `'ltr'` or `'rtl'`.
		 *
		 * @readonly
		 * @member {String}
		 */
		this.contentLanguageDirection = getLanguageDirection( this.contentLanguage );

		/**
		 * Translates the given message to the {@link #uiLanguage}. This method is also available in
		 * {@link module:core/editor/editor~Editor#t} and {@link module:ui/view~View#t}, however this function needs to be called
		 * as a function to make the translation mechanism work. [TODO]
		 *
		 * The message can be either a string or an object implementing the {@link module:translation-service~Message} interface.
		 *
		 * Messages may contain placeholders (`%<index>`) for values that are passed as the second argument.
		 * `<index>` is the index in the `values` array.
		 *
		 *		t( 'Created file "%0" in %1ms.', [ fileName, timeTaken ] );
		 *
		 * This method's context is statically bound to the `Locale` instance,
		 * so it can be called as a function:
		 *
		 *		const t = this.t;
		 *		t( 'Label' );
		 *
		 * @method #t
		 * @param {String|module:utils/translation-service~Message} message A message that will be localized.
		 * @param {Array.<String>} [values] Values that should be used to interpolate the string.
		 */
		this.t = ( message, values ) => this._t( message, values );
	}

	/**
	 * The editor UI language code in the [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format.
	 *
	 * **Note**: This property has been deprecated. Please use {@link #uiLanguage} and {@link #contentLanguage}
	 * properties instead.
	 *
	 * @deprecated
	 * @member {String}
	 */
	get language() {
		/**
		 * The {@link module:utils/locale~Locale#language `Locale#language`} property has been deprecated and will
		 * be removed in the near future. Please use {@link #uiLanguage} and {@link #contentLanguage} properties instead.
		 *
		 * @error locale-deprecated-language-property
		 */
		console.warn(
			'locale-deprecated-language-property: ' +
			'The Locale#language property has been deprecated and will be removed in the near future. ' +
			'Please use #uiLanguage and #contentLanguage properties instead.' );

		return this.uiLanguage;
	}

	/**
	 * Base for the {@link #t} method.
	 *
	 * @param {module:utils/translation-service~Message|String} message
	 * @param {Array.<String>} [values]
	 * @private
	 */
	_t( message, values = [] ) {
		if ( typeof message === 'string' ) {
			message = { string: message };
		}

		const hasPluralForm = !!message.plural;
		const amount = hasPluralForm ? values[ 0 ] : 1;

		let translatedString = translate( this.uiLanguage, message, amount );

		if ( values ) {
			translatedString = translatedString.replace( /%(\d+)/g, ( match, index ) => {
				return ( index < values.length ) ? values[ index ] : match;
			} );
		}

		return translatedString;
	}
}

// Helps determine whether a language is LTR or RTL.
//
// @param {String} language The ISO 639-1 language code.
// @returns {String} 'ltr' or 'rtl
function getLanguageDirection( languageCode ) {
	return RTL_LANGUAGE_CODES.includes( languageCode ) ? 'rtl' : 'ltr';
}
