/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { translate, add, _clear } from '../src/translation-service';

describe( 'translation-service', () => {
	afterEach( () => {
		_clear();
	} );

	it( 'should return english string if no translation exists', () => {
		const translation = translate( 'pl', undefined, 'Bold' );

		expect( translation ).to.be.equal( 'Bold' );
	} );

	it( 'should return translation if the translation for the concrete language is defined', () => {
		add( 'pl', {
			'ok': 'OK',
			'cancel': 'Anuluj'
		} );

		const translation = translate( 'pl', undefined, 'Cancel' );

		expect( translation ).to.be.equal( 'Anuluj' );
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
