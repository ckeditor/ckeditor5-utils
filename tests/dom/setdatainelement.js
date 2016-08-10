/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals document */
/* bender-tags: dom, browser-only */

import setDataInElement from '/ckeditor5/utils/dom/setdatainelement.js';
import getDataFromElement from '/ckeditor5/utils/dom/getdatafromelement.js';

describe( 'setDataInElement', () => {
	[ 'textarea', 'template', 'div' ].forEach( ( elementName ) => {
		it( 'should set the content of a ' + elementName, () => {
			const el = document.createElement( elementName );
			const expectedData = '<b>foo</b>';

			setDataInElement( el, expectedData );

			const actualData = getDataFromElement( el );
			expect( actualData ).to.equal( expectedData );
		} );
	} );
} );
