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
		 * Translates the given string to the {@link #uiLanguage}.
		 *
		 * This method is also available in
		 * {@link module:core/editor/editor~Editor#t} and {@link module:ui/view~View#t}.
		 *
		 * The string may contain placeholders (`%<index>`) for given dynamic values.
		 * `<index>` is the index in the `values` array.
		 *
		 *		editor.t( 'Created file "%0" in %1ms', [ fileName, time ] );
		 *
		 * @method #t
		 * @param {String} msgid The string to translate.
		 * @param {String[]} [values] Values that should be used to interpolate the string.
		 */
		this.t = ( msgid, values ) => this._t( msgid, values );

		/**
		 * Translates the given string to the {@link #uiLanguage}.
		 *
		 * This method allows passing the context as the first argument.
		 * A context is used to provide a description or example of how the translated string will be used.
		 * An unique context makes the whole translation unique and should be presented to the translator.
		 *
		 * The string may contain placeholders (`%<index>`) for given dynamic values.
		 * `<index>` is the index in the `values` array.
		 *
		 *		editor.ct( 'Created file "x"', 'file "%0"', [ fileName ] );
		 *
		 * If at least one of the placeholder values is not a string or number,
		 * then an array of all the literal and dynamic parts will be returned
		 *
		 * @method #ct
		 * @template T
		 * @param {string} msgctxt The context string.
		 * @param {string} msgid The string to translate.
		 * @param {T[]} [values] Values that should be used to interpolate the string.
		 * @returns {T extends object ? Array<T | string> : string}
		 */
		this.ct = ( msgctxt, msgid, values ) => this._ct( msgctxt, msgid, values );

		/**
		 * Translates the given plural string to the {@link #uiLanguage}.
		 *
		 * This method is also available in
		 * {@link module:core/editor/editor~Editor#t} and {@link module:ui/view~View#t}.
		 *
		 * This method allows passing the context as the first argument.
		 * A context is used to provide a description or example of how the translated string will be used.
		 * An unique context makes the whole translation unique and should be presented to the translator.
		 *
		 * The strings may contain a placeholder (`%0`) for a given dynamic value.
		 * The value is also used for selecting the correct plural form.
		 *
		 *		editor.ctn( 'Created n files', '%0 file' '%0 files' fileCount );
		 *
		 * @method #ctn
		 * @param {string} msgctxt The context string.
		 * @param {string} msgid Singular form of a string to translate.
		 * @param {string} msgidPlural Plural form of a string to translate.
		 * @param {number} value Value that should be used to interpolate the string.
		 * @returns {string}
		 */
		this.ctn = ( msgctxt, msgid, msgidPlural, value ) => this._ctn( msgctxt, msgid, msgidPlural, value );
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
	 * @private
	 */
	_t( msgid = '', values = [] ) {
		return translate( this.uiLanguage, msgid )
			.replace( /%(\d+)/g, ( match, idx ) => values[ idx ] );
	}

	/**
	 * Base for the {@link #ct} method.
	 * @private
	 */
	_ct( msgctxt = '', msgid = '', values = [] ) {
		const msg = translate( this.uiLanguage, `${ msgid } [context: ${ msgctxt }]` );
		const regex = /%(\d+)/g;
		const parts = [];

		while ( true ) {
			const prevIndex = regex.lastIndex;
			const match = regex.exec( msg );
			if ( match == null ) {
				parts.push( msg.substring( prevIndex ) );
				break;
			}
			parts.push( msg.substring( prevIndex, match.index ) );
			parts.push( values[ match[ 1 ] ] );
		}

		if ( values.some( value => typeof value == 'object' ) ) {
			return parts;
		}
		return parts.join( '' );
	}

	/**
	 * Base for the {@link #ctn} method.
	 * @private
	 */
	_ctn( msgctxt = '', msgid = '', msgidPlural = '', value = 0 ) {
		return this._ct( msgctxt, value == 1 ? msgid : msgidPlural, [ value ] );
	}
}

// Helps determine whether a language is LTR or RTL.
//
// @param {String} language The ISO 639-1 language code.
// @returns {String} 'ltr' or 'rtl
function getLanguageDirection( languageCode ) {
	return RTL_LANGUAGE_CODES.includes( languageCode ) ? 'rtl' : 'ltr';
}
