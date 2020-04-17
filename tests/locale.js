/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals console */

import Locale from '../src/locale';
import {
	add as addTranslations,
	_clear as clearTranslations
} from '../src/translation-service';

describe( 'Locale', () => {
	afterEach( () => {
		clearTranslations();
		sinon.restore();
	} );

	describe( 'constructor', () => {
		it( 'sets the #language', () => {
			const locale = new Locale( {
				uiLanguage: 'pl'
			} );

			expect( locale ).to.have.property( 'uiLanguage', 'pl' );
		} );

		it( 'sets the #contentLanguage', () => {
			const locale = new Locale( {
				uiLanguage: 'pl',
				contentLanguage: 'en'
			} );

			expect( locale ).to.have.property( 'uiLanguage', 'pl' );
			expect( locale ).to.have.property( 'contentLanguage', 'en' );
		} );

		it( 'defaults #language to en', () => {
			const locale = new Locale();

			expect( locale ).to.have.property( 'uiLanguage', 'en' );
		} );

		it( 'inherits the #contentLanguage from the #language (if not passed)', () => {
			const locale = new Locale( {
				uiLanguage: 'pl'
			} );

			expect( locale ).to.have.property( 'uiLanguage', 'pl' );
			expect( locale ).to.have.property( 'contentLanguage', 'pl' );
		} );

		it( 'determines the #uiLanguageDirection', () => {
			expect( new Locale( {
				uiLanguage: 'pl'
			} ) ).to.have.property( 'uiLanguageDirection', 'ltr' );

			expect( new Locale( {
				uiLanguage: 'en'
			} ) ).to.have.property( 'uiLanguageDirection', 'ltr' );

			expect( new Locale( {
				uiLanguage: 'ar'
			} ) ).to.have.property( 'uiLanguageDirection', 'rtl' );

			expect( new Locale( {
				uiLanguage: 'fa'
			} ) ).to.have.property( 'uiLanguageDirection', 'rtl' );

			expect( new Locale( {
				uiLanguage: 'he'
			} ) ).to.have.property( 'uiLanguageDirection', 'rtl' );

			expect( new Locale( {
				uiLanguage: 'ku'
			} ) ).to.have.property( 'uiLanguageDirection', 'rtl' );

			expect( new Locale( {
				uiLanguage: 'ug'
			} ) ).to.have.property( 'uiLanguageDirection', 'rtl' );
		} );

		it( 'determines the #contentLanguageDirection (not passed)', () => {
			expect( new Locale( {
				uiLanguage: 'pl'
			} ) ).to.have.property( 'contentLanguageDirection', 'ltr' );

			expect( new Locale( {
				uiLanguage: 'en'
			} ) ).to.have.property( 'contentLanguageDirection', 'ltr' );

			expect( new Locale( {
				uiLanguage: 'ar'
			} ) ).to.have.property( 'contentLanguageDirection', 'rtl' );
		} );

		it( 'determines the #contentLanguageDirection (passed)', () => {
			expect( new Locale( {
				uiLanguage: 'pl',
				contentLanguage: 'pl'
			} ) ).to.have.property( 'contentLanguageDirection', 'ltr' );

			expect( new Locale( {
				uiLanguage: 'en',
				contentLanguage: 'ar'
			} ) ).to.have.property( 'contentLanguageDirection', 'rtl' );

			expect( new Locale( {
				uiLanguage: 'ar',
				contentLanguage: 'pl'
			} ) ).to.have.property( 'contentLanguageDirection', 'ltr' );
		} );
	} );

	describe( 't', () => {
		let locale;

		beforeEach( () => {
			// eslint-disable-next-line no-nested-ternary
			const getPolishPluralForm = n => n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && ( n % 100 < 10 || n % 100 >= 20 ) ? 1 : 2;

			addTranslations( 'pl', {
				'foo': 'foo_pl',
				'bar': [ 'bar_pl_0', '%0 bar_pl_1', '%0 bar_pl_2' ]
			}, getPolishPluralForm );

			addTranslations( 'de', {
				'foo': 'foo_de',
				'bar': [ 'bar_de_0', '%0 bar_de_1', '%0 bar_de_2' ]
			} );

			locale = new Locale( {
				uiLanguage: 'pl',
				contentLanguage: 'de'
			} );
		} );

		it( 'should translate a string to the target ui language', () => {
			const t = locale.t;

			expect( t( 'foo' ) ).to.equal( 'foo_pl' );
		} );

		it( 'should translate a plural form to the target ui language based on the first value and interpolate the string', () => {
			const t = locale.t;

			expect( t( { string: 'bar', plural: '%0 bars' }, [ 1 ] ), 1 ).to.equal( 'bar_pl_0' );
			expect( t( { string: 'bar', plural: '%0 bars' }, [ 2 ] ), 2 ).to.equal( '2 bar_pl_1' );
			expect( t( { string: 'bar', plural: '%0 bars' }, [ 5 ] ), 3 ).to.equal( '5 bar_pl_2' );
		} );

		it( 'should interpolate a message with provided values', () => {
			const t = locale.t;

			expect( t( '%0 - %0', [ 'foo' ] ) ).to.equal( 'foo - foo' );
			expect( t( '%1 - %0 - %2', [ 'a', 'b', 'c' ] ) ).to.equal( 'b - a - c' );

			// Those test make sure that if %0 is really to be used, then it's going to work.
			// It'd be a super rare case if one would need to use %0 and at the same time interpolate something.
			expect( t( '%1 - %0 - %2' ) ).to.equal( '%1 - %0 - %2' );
			expect( t( '%1 - %0 - %2', [ 'a' ] ) ).to.equal( '%1 - a - %2' );
		} );
	} );

	describe( 'language()', () => {
		it( 'should return #uiLanguage', () => {
			const stub = sinon.stub( console, 'warn' );
			const locale = new Locale();

			expect( locale.language ).to.equal( locale.uiLanguage );
			sinon.assert.calledWithMatch( stub, 'locale-deprecated-language-property' );
		} );

		it( 'should warn about deprecation', () => {
			const stub = sinon.stub( console, 'warn' );
			const locale = new Locale();

			expect( locale.language ).to.equal( 'en' );
			sinon.assert.calledWithMatch( stub, 'locale-deprecated-language-property' );
		} );
	} );
} );
