/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { translate, translatePlural, add, _clear } from '../src/translation-service';

describe( 'translation-service', () => {
	afterEach( () => {
		_clear();
	} );

	it( 'should return english string if no message exists', () => {
		const translation = translate( 'pl', undefined, 'Bold' );

		expect( translation ).to.be.equal( 'Bold' );
	} );

	it( 'should return english string if no message with context exists', () => {
		const translation = translate( 'pl', 'Toolbar', 'Bold' );

		expect( translation ).to.be.equal( 'Bold' );
	} );

	it( 'should return correct english plural string if no message exists', () => {
		expect( translatePlural( 'pl', undefined, 'Thing', '# things', 3 ) )
			.to.be.equal( '3 things' );

		expect( translatePlural( 'pl', undefined, 'Thing', '# things', 1 ) )
			.to.be.equal( 'Thing' );
	} );

	it( 'should return localized message if the message is defined', () => {
		add( 'pl', {
			'ok': 'OK',
			'cancel': 'Anuluj'
		} );

		const translation = translate( 'pl', undefined, 'Cancel' );

		expect( translation ).to.be.equal( 'Anuluj' );
	} );

	it( 'should return localized message if the message with context is defined', () => {
		add( 'pl', {
			'dialog modal|ok': 'OK',
			'dialog modal|cancel': 'Anuluj'
		} );

		const translation = translate( 'pl', 'Dialog Modal', 'Cancel' );

		expect( translation ).to.be.equal( 'Anuluj' );
	} );

	it( 'should return localized message if the message with context is defined but context isn\'t passed', () => {
		add( 'pl', {
			'dialog modal|ok': 'OK',
			'dialog modal|cancel': 'Anuluj'
		} );

		const translation = translate( 'pl', undefined, 'Cancel' );

		expect( translation ).to.be.equal( 'Anuluj' );
	} );

	it( 'should return localized plural message if the message is defined', () => {
		add( 'pl', {
			'PLURAL_FORMS': 'nplurals=3;plural=n==1?0:n<=4?1:2',
			'table': [ 'tabelka', '# tabelki', '# tabelek' ]
		} );

		expect( translatePlural( 'pl', undefined, 'table', '# tables', 1 ) )
			.to.be.equal( 'tabelka' );
		expect( translatePlural( 'pl', undefined, 'table', '# tables', 3 ) )
			.to.be.equal( '3 tabelki' );
		expect( translatePlural( 'pl', undefined, 'table', '# tables', 7 ) )
			.to.be.equal( '7 tabelek' );
	} );

	it( 'should use provided language if only one is provided', () => {
		add( 'pl', {
			'ok': 'OK',
			'cancel': 'Anuluj'
		} );

		const translation = translate( 'de', undefined, 'cancel' );

		expect( translation ).to.be.equal( 'Anuluj' );
	} );

	it( 'should be able to merge translations', () => {
		add( 'pl', {
			'ok': 'OK',
			'cancel': 'Anuluj'
		} );

		add( 'en_US', {
			'ok': 'OK',
			'cancel': 'Cancel'
		} );

		const translationPL = translate( 'pl', undefined, 'Cancel' );
		const translationEN = translate( 'en', undefined, 'Cancel' );

		expect( translationPL ).to.be.equal( 'Anuluj' );
		expect( translationEN ).to.be.equal( 'Cancel' );
	} );
} );
