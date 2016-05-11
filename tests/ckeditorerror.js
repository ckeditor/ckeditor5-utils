/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import CKEditorError from '/ckeditor5/utils/ckeditorerror.js';

describe( 'CKEditorError', () => {
	describe( 'constructor', () => {
		it( 'inherits from Error', () => {
			let error = new CKEditorError( 'foo' );

			expect( error ).to.be.an.instanceOf( Error );
			expect( error ).to.be.an.instanceOf( CKEditorError );
		} );

		it( 'sets the name', () => {
			let error = new CKEditorError( 'foo' );

			expect( error ).to.have.property( 'name', 'CKEditorError' );
		} );

		it( 'sets the message', () => {
			let error = new CKEditorError( 'foo' );

			expect( error ).to.have.property( 'message', 'foo' );
			expect( error.data ).to.be.undefined;
		} );

		it( 'sets the message and data', () => {
			let data = { bar: 1 };
			let error = new CKEditorError( 'foo', data );

			expect( error ).to.have.property( 'message', 'foo {"bar":1}' );
			expect( error ).to.have.property( 'data', data );
		} );

		it( 'appends stringified data to the message', () => {
			class Foo {
				constructor() {
					this.x = 1;
				}
			}

			let data = {
				bar: 'a',
				bom: new Foo(),
				bim: document.body
			};
			let error = new CKEditorError( 'foo', data );

			expect( error ).to.have.property( 'message', 'foo {"bar":"a","bom":{"x":1},"bim":{}}' );
			expect( error ).to.have.property( 'data', data );
		} );
	} );

	describe( 'isErrorWithName', () => {
		it( 'should return true if error is an CKEditorError instance and ' +
			'name is equal to error-name when there is only error-name in error.message',
			() => {
				let error = new CKEditorError( 'error-name' );

				expect( CKEditorError.isErrorWithName( error, 'error-name' ) ).to.be.true;
			}
		);

		it( 'should return true if error is an CKEditorError instance and ' +
			'name equal to error-name when there is error-name ' +
			'with additional Error message in error.message',
			() => {
				let error = new CKEditorError( 'error-message: Error message' );

				expect( CKEditorError.isErrorWithName( error, 'error-name' ) ).to.be.true;
			}
		);

		it( 'should return false if error is not an CKEditorError instance', () => {
			let error = new RangeError();

			expect( CKEditorError.isErrorWithName( error ) ).to.be.false;
		} );

		it( 'should return false if error is not an CKEditorError instance ' +
			'and name is equal to error-name from error.message',
			() => {
				let error = new RangeError( 'error-name' );

				expect( CKEditorError.isErrorWithName( error, 'error-name' ) ).to.be.false;
			}
		);

		it( 'should return false if error is not an CKEditorError instance ' +
			'and name is not equal to error-name from error.message',
			() => {
				let error = new RangeError( 'error-name' );

				expect( CKEditorError.isErrorWithName( error, 'diffrent-error-name' ) ).to.be.false;
			}
		);

		it( 'should return false if error is an CKEditorError instance ' +
			'and name is not equal to error-name from error.message',
			() => {
				let error = new RangeError( 'error-name' );

				expect( CKEditorError.isErrorWithName( error, 'different-error-name' ) ).to.be.false;
			}
		);
	} );
} );
