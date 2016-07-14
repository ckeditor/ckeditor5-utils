/* jshint node: true, esnext: true */

'use strict';

const gulp = require( 'gulp' );
const build = require( 'lodash-cli' );
const del = require( 'del' );

const destPath = 'src/lib/lodash';

module.exports = function() {
	const tasks = {
		lodash() {
			return del( destPath )
				.then( buildLodash );
		}
	};

	gulp.task( 'lodash', tasks.lodash );

	return tasks;
};

function buildLodash() {
	return new Promise( ( resolve, reject ) => {
		build( [
			'modularize',
			'exports=es',
			'--development',
			'--output', destPath
		], ( err ) => {
			if ( err instanceof Error ) {
				reject( err );
			} else {
				resolve( null );
			}
		} );
	} );
}
