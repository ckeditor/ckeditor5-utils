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
		 * @method #t
		 * @param {String} msgid The string to translate.
		 * @returns {String}
		 */
		this.t = ( msgid, values ) => this._t( msgid, values );

		/**
		 * Translates the given string to the {@link #uiLanguage}.
		 *
		 * This method allows passing the context as the first argument.
		 * A context is used to provide a description or example of how the translated string will be used.
		 * An unique context makes the whole translation unique.
		 *
		 * @method #ct
		 * @param {String} msgctxt The context string.
		 * @param {String} msgid The string to translate.
		 * @returns {Message}
		 */
		this.ct = ( msgctxt, msgid ) => this._ct( msgctxt, msgid );

		/**
		 * Translates the given plural string to the {@link #uiLanguage}.
		 *
		 * This method allows passing the context as the first argument.
		 * A context is used to provide a description or example of how the translated string will be used.
		 * An unique context makes the whole translation unique.
		 *
		 * The strings may contain a placeholder (`#`) for a given dynamic quantity value.
		 * The value is also used for selecting the correct plural form.
		 *
		 *		ctn( 'Created # files', 'file', '# files', fileCount );
		 *
		 * @method #ctn
		 * @param {String} msgctxt The context string.
		 * @param {String} msgid Singular form of a string to translate.
		 * @param {String} msgidPlural Plural form of a string to translate.
		 * @param {Number} quantity
		 * @returns {Message}
		 */
		this.ctn = ( msgctxt, msgid, msgidPlural, quantity ) => this._ctn( msgctxt, msgid, msgidPlural, quantity );
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
		const translation = translate( this.uiLanguage, msgid );
		const message = new Message( translation );
		return message.format( ...values );
	}

	/**
	 * Base for the {@link #ct} method.
	 * @private
	 */
	_ct( msgctxt = '', msgid = '' ) {
		const translation = translate( this.uiLanguage, `${ msgid } [context: ${ msgctxt }]` );
		return new Message( translation );
	}

	/**
	 * Base for the {@link #ctn} method.
	 * @private
	 */
	_ctn( msgctxt = '', msgid = '', msgidPlural = '', quantity = 1 ) {
		let translation = translate(
			this.uiLanguage,
			`${ quantity == 1 ? msgid : msgidPlural } [context: ${ msgctxt }]`
		);
		translation = translation.replace( /#/g, quantity );
		return new Message( translation );
	}
}

// Helps determine whether a language is LTR or RTL.
//
// @param {String} language The ISO 639-1 language code.
// @returns {String} 'ltr' or 'rtl
function getLanguageDirection( languageCode ) {
	return RTL_LANGUAGE_CODES.includes( languageCode ) ? 'rtl' : 'ltr';
}

/**
 * A translated message returned from one of the {@link Locale}'s methods.
 */
export class Message {
	/**
	 * @hidden
	 * @param {String} message
	 */
	constructor( message ) {
		/**
		 * @readonly
		 * @member {String}
		 */
		this.message = String( message );
	}

	/**
	 * Get the message as a string without any transformations
	 * @returns {String}
	 */
	toString() {
		return this.message;
	}

	/**
	 * Get the interpolated message as string.
	 * This method will replace the placeholders in the message with provided values.
	 *
	 * @example
	 *
	 * 		const msg = ct( 'Replace text', 'Replace %0 with %1' )
	 * 			.format( 'foo', 'bar' )
	 *
	 * 		expect( msg ).to.equal( 'Replace foo with bar' )
	 *
	 * @param {...String} values
	 * @returns {String} The interpolated message
	 */
	format( ...values ) {
		return this.message.replace( /%(\d+)/g, ( match, index ) => values[ parseInt( index, 10 ) ] );
	}

	/**
	 * Get the interpolated message as an array of static and dynamic parts.
	 * This method splits the message at every placeholder
	 * and returns an array of the original string parts with provided values interspersed.
	 * The values can be of any type and won't be stringified.
	 *
	 * @example
	 *
	 * 		const msg = ct( 'Replace text', 'Replace %0 with %1' )
	 * 			.formatToParts( 'foo', 'bar' )
	 *
	 * 		expect( msg ).to.equal( [
	 * 			{ part: 'literal', value: 'Replace ' },
	 * 			{ part: 'value', value: 'foo' },
	 * 			{ part: 'literal', value: ' with ' },
	 * 			{ part: 'value', value: 'bar' },
	 * 		] )
	 *
	 * @template T
	 * @param {...T} values
	 * @returns {Array.<Part.<T>>} The array of interpolated message parts
	 */
	formatToParts( ...values ) {
		const regex = /%(\d+)/g;

		/** @type {Part<T>[]} */
		const parts = [];

		while ( true ) {
			const prevIndex = regex.lastIndex;
			const match = regex.exec( this.message );
			if ( match == null ) {
				parts.push( {
					part: 'literal',
					value: this.message.substring( prevIndex )
				} );
				break;
			}
			parts.push( {
				part: 'literal',
				value: this.message.substring( prevIndex, match.index )
			} );
			parts.push( {
				part: 'value',
				value: values[ parseInt( match[ 1 ], 10 ) ]
			} );
		}

		return parts;
	}
}

/**
 * @template T
 * @typedef {{ part: 'literal', value: string } | { part: 'value', value: T }} Part
 */
