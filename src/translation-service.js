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
 * Adds localized messages to the global dictionary.
 * Message keys should be lowercase version of the original message in English (message ID).
 *
 *		add( 'pl', {
 *			'continue': 'Kontynuuj',
 *			'cancel': 'Anuluj'
 *		} );
 *
 * You can use a vertical bar to separate message context and ID.
 *
 * 		add( 'pl', {
 * 			'toolbar|table': 'Tabelka',
 * 			'add/remove|table': 'tabelkę',
 * 		})
 *
 * For plural messages you can provide an array with localized message for each plural form.
 *
 * 		add( 'pl', {
 * 			'add/remove|table': [ 'tabelkę', '# tabelki', '# tabelek' ],
 * 		})
 *
 * Special `PLURAL_FORMS` key should contain the plural forms header in PO format.
 *
 * 		add( 'pl', {
 * 			'PLURAL_FORMS': `
 * 				nplurals=4;
 * 				plural=
 * 					n==1 ? 0 :
 * 					(n%10>=2&&n%10<=4)&&(n%100<12||n%100>14) ? 1 :
 * 					n!=1&&(n%10>=0&&n%10<=1)||(n%10>=5&&n%10<=9)||(n%100>=12&&n%100<=14) ? 2 :
 * 					3;
 * 			`
 * 		})
 *
 * @param {String} language Language of the localized messages.
 * @param {Record.<String, String>} messages Localized messages which will be added to the dictionary.
 */
export function add( language, messages ) {
	const dictionary = window.CKEDITOR_TRANSLATIONS[ language ] || ( window.CKEDITOR_TRANSLATIONS[ language ] = {} );

	Object.assign( dictionary, messages );
}

/**
 * Get a localized message(s) for a particular language and ID.
 * Will return an array for plural messages.
 * Returns null if the localized message doesn't exist.
 *
 * @param {String} language
 * @param {?String} msgCtx The message context.
 * @param {String} msgId The message ID.
 * @returns {String | Array.<String> | null} The localized message(s) if they exist.
 */
function getMessage( language, msgCtx, msgId ) {
	const localeData = window.CKEDITOR_TRANSLATIONS[ language ];
	if ( localeData != null ) {
		let key = String( msgId ).toLowerCase();
		if ( msgCtx !== null ) {
			key = `${ String( msgCtx ).toLowerCase() }|${ key }`;
		}

		const message = localeData[ key ];
		if ( message != null ) {
			return message;
		}
	}

	return null;
}

/**
 * Attempts to localize a message given an ID and context.
 * Defaults to English.
 *
 * @param {String} language Target language.
 * @param {?String} msgCtx Message context.
 * @param {String} msgId Message ID.
 * @returns {String} Localized message.
 */
export function translate( language, msgCtx, msgId ) {
	const message = getMessage( language, msgCtx, msgId );

	// Fall back to the English translation.
	if ( message == null ) {
		return msgId;
	}

	// Fall back to singular form in case of translation with plural forms.
	if ( Array.isArray( message ) ) {
		return message[ 0 ];
	}

	return String( message );
}

/**
 * Default plural form selector if none was provided.
 * Applies English plural rules.
 *
 * @type {PluralFormSelector}
 */
const selectDefaultPluralForm = n => Number( n != 1 );

/**
 * Attempts to localize a plural message given an ID, context and quantity.
 * This also replaces the pound sign `#` in the message with the provided quantity.
 * Defaults to English.
 *
 * @param {String} language Target language.
 * @param {?String} msgCtx Message context.
 * @param {String} msgId Message ID.
 * @param {String} msgIdPlural Message ID - plural form.
 * @param {Number} quantity The number to use for selecting the plural form for a particular language.
 * @returns {String} Localized message.
 */
export function translatePlural( language, msgCtx, msgId, msgIdPlural, quantity ) {
	const messages = getMessage( language, msgCtx, msgId );
	let message;

	if ( Array.isArray( messages ) ) {
		const selectPluralForm = getPluralFormSelector( language );
		const pluralForm = selectPluralForm( quantity );

		// Select appropriate plural form.
		if ( pluralForm in messages ) {
			message = messages[ pluralForm ];
		}
		// Fall back to the singular form.
		else if ( messages[ 0 ] != null ) {
			message = messages[ 0 ];
		}
	}
	// Fall back to the regular translation in case of translation without plural forms.
	else if ( messages != null ) {
		message = String( messages );
	}

	// Fall back to the English translation.
	if ( message == null ) {
		message = [ msgId, msgIdPlural ][ selectDefaultPluralForm( quantity ) ];
	}

	// Format the number
	let number;
	if ( Intl.NumberFormat != null ) {
		const formatter = new Intl.NumberFormat( language );
		number = formatter.format( number );
	} else {
		number = String( quantity );
	}
	message = message.replace( /#/g, number );

	return message;
}

/**
 * Returns a function which maps a number to a plural form for the given language.
 * Uses the special `PLURAL_RULES` key in the translations dictionary.
 *
 * @param {String} language Target language.
 * @returns {PluralFormSelector}
 */
function getPluralFormSelector( language ) {
	const pluralFormsString = getMessage( language, undefined, 'PLURAL_FORMS' );

	const pluralFormsMatch = pluralFormsString.match(
		/\s*nplurals\s*=\s*\d+\s*;\s*plural\s*=\s*([-+*/!=<>%&|?:.n\d\s]+);?\s*$/i
	);
	if ( pluralFormsMatch != null ) {
		const [ , pluralFormula ] = pluralFormsMatch;

		// This expression can either evaluate to a number
		// or a boolean in case of a language with only singular and plural forms.
		// We cast it to a number so that false becomes 0 and true becomes 1.

		// eslint-disable-next-line no-new-func
		return new Function( 'n', `return Number(${ pluralFormula })` );
	}

	return selectDefaultPluralForm;
}

/**
 * Maps a number to a plural form in a particular language.
 * For languages with only two plural forms returns 0 for singular and 1 for plural.
 *
 * @typedef {function(Number): Number} PluralFormSelector
 */

/**
 * Clears dictionaries for test purposes.
 *
 * @protected
 */
export function _clear() {
	window.CKEDITOR_TRANSLATIONS = {};
}
