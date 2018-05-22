/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import env, { isMac, isIOS } from '../src/env';

describe( 'Env', () => {
	beforeEach( () => {
	} );

	it( 'is an object', () => {
		expect( env ).to.be.an( 'object' );
	} );

	describe( 'isMac', () => {
		it( 'is a boolean', () => {
			expect( env.isMac ).to.be.a( 'boolean' );
		} );

		it( 'returns true for macintosh UA strings', () => {
			expect( isMac( 'macintosh' ) ).to.be.true;
			expect( isMac( 'foo macintosh bar' ) ).to.be.true;
		} );

		it( 'returns false for non–macintosh UA strings', () => {
			expect( isMac( '' ) ).to.be.false;
			expect( isMac( 'mac' ) ).to.be.false;
			expect( isMac( 'foo' ) ).to.be.false;
		} );
	} );

	describe( 'isIOS', () => {
		it( 'is a boolean', () => {
			expect( env.isIOS ).to.be.a( 'boolean' );
		} );

		it( 'returns true for macintosh UA strings', () => {
			expect( isIOS( 'ipad' ) ).to.be.true;
			expect( isIOS( 'iphone' ) ).to.be.true;
			expect( isIOS( 'ipod' ) ).to.be.true;
			expect( isIOS( 'foo ipad bar' ) ).to.be.true;
		} );

		it( 'returns false for non–macintosh UA strings', () => {
			expect( isIOS( '' ) ).to.be.false;
			expect( isIOS( 'whatever' ) ).to.be.false;
		} );
	} );
} );
