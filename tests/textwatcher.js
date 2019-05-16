/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import ModelTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/modeltesteditor';
import testUtils from '@ckeditor/ckeditor5-core/tests/_utils/utils';

import { setData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import TextWatcher from '../src/textwatcher';

describe( 'TextWatcher', () => {
	let editor, model, doc;

	testUtils.createSinonSandbox();

	beforeEach( () => {
		return ModelTestEditor.create()
			.then( newEditor => {
				editor = newEditor;
				model = editor.model;
				doc = model.document;

				model.schema.register( 'paragraph', { inheritAllFrom: '$block' } );
			} );
	} );

	afterEach( () => {
		sinon.restore();

		if ( editor ) {
			return editor.destroy();
		}
	} );

	describe( 'events', () => {
		let watcher, matchedSpy, unmatchedSpy, testCallbackStub;

		beforeEach( () => {
			testCallbackStub = sinon.stub();
			matchedSpy = sinon.spy();
			unmatchedSpy = sinon.spy();

			setData( model, '<paragraph>foo []</paragraph>' );

			watcher = new TextWatcher( model, testCallbackStub, () => {} );
			watcher.on( 'matched', matchedSpy );
			watcher.on( 'unmatched', unmatchedSpy );
		} );

		it( 'should evaluate text before selection for data changes', () => {
			model.change( writer => {
				writer.insertText( '@', doc.selection.getFirstPosition() );
			} );

			sinon.assert.calledOnce( testCallbackStub );
			sinon.assert.calledWithExactly( testCallbackStub, 'foo @' );
		} );

		it( 'should evaluate text for selection changes', () => {
			model.change( writer => {
				writer.setSelection( doc.getRoot().getChild( 0 ), 1 );
			} );

			sinon.assert.calledOnce( testCallbackStub );
			sinon.assert.calledWithExactly( testCallbackStub, 'f' );
		} );

		it( 'should not evaluate text for transparent batches', () => {
			model.enqueueChange( 'transparent', writer => {
				writer.insertText( '@', doc.selection.getFirstPosition() );
			} );

			sinon.assert.notCalled( testCallbackStub );
		} );

		it( 'should fire "matched" event when test callback returns true', () => {
			testCallbackStub.returns( true );

			model.change( writer => {
				writer.insertText( '@', doc.selection.getFirstPosition() );
			} );

			sinon.assert.calledOnce( testCallbackStub );
			sinon.assert.calledOnce( matchedSpy );
			sinon.assert.notCalled( unmatchedSpy );
		} );

		it( 'should not fire "matched" event when test callback returns false', () => {
			testCallbackStub.returns( false );

			model.change( writer => {
				writer.insertText( '@', doc.selection.getFirstPosition() );
			} );

			sinon.assert.calledOnce( testCallbackStub );
			sinon.assert.notCalled( matchedSpy );
			sinon.assert.notCalled( unmatchedSpy );
		} );

		it( 'should fire "unmatched" event when test callback returns false when it was previously matched', () => {
			testCallbackStub.returns( true );

			model.change( writer => {
				writer.insertText( '@', doc.selection.getFirstPosition() );
			} );

			sinon.assert.calledOnce( testCallbackStub );
			sinon.assert.calledOnce( matchedSpy );
			sinon.assert.notCalled( unmatchedSpy );

			testCallbackStub.returns( false );

			model.change( writer => {
				writer.insertText( '@', doc.selection.getFirstPosition() );
			} );

			sinon.assert.calledTwice( testCallbackStub );
			sinon.assert.calledOnce( matchedSpy );
			sinon.assert.calledOnce( unmatchedSpy );
		} );
	} );
} );

