/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module utils/forcedisabledmixin
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

/**
 * Mixin that injects the "disabling and enabling methods".
 *
 *
 * @mixin ForceDisabledMixin
 * @implements module:utils/forcedisabledmixin~ForceDisabledMixin
 */

const ForceDisabledMixin = {
	/**
	 * Disables command or plugin which has implemented `isEnabled` observable.
	 *
	 * Command may be disabled by multiple features or algorithms (at once). When disabling a command, unique id should be passed
	 * (e.g. feature name). The same identifier should be used when {@link #clearForceDisabled enabling back} the command.
	 * The command becomes enabled only after all features {@link #clearForceDisabled enabled it back}.
	 *
	 * Disabling and enabling a command:
	 *
	 *		command.isEnabled; // -> true
	 *		command.forceDisabled( 'MyFeature' );
	 *		command.isEnabled; // -> false
	 *		command.clearForceDisabled( 'MyFeature' );
	 *		command.isEnabled; // -> true
	 *
	 * Command disabled by multiple features:
	 *
	 *		command.forceDisabled( 'MyFeature' );
	 *		command.forceDisabled( 'OtherFeature' );
	 *		command.clearForceDisabled( 'MyFeature' );
	 *		command.isEnabled; // -> false
	 *		command.clearForceDisabled( 'OtherFeature' );
	 *		command.isEnabled; // -> true
	 *
	 * Multiple disabling with the same identifier is redundant:
	 *
	 *		command.forceDisabled( 'MyFeature' );
	 *		command.forceDisabled( 'MyFeature' );
	 *		command.clearForceDisabled( 'MyFeature' );
	 *		command.isEnabled; // -> true
	 *
	 * **Note:** some commands or algorithms may have more complex logic when it comes to enabling or disabling certain commands,
	 * so the command might be still disabled after {@link #clearForceDisabled} was used.
	 *
	 * All above also match plugins **which have implemented `isEnabled` observable**.
	 *
	 * Disabling and enabling a plugin:
	 *
	 *		plugin.isEnabled; // -> true
	 *		plugin.forceDisabled( 'MyFeature' );
	 *		plugin.isEnabled; // -> false
	 *		plugin.clearForceDisabled( 'MyFeature' );
	 *		plugin.isEnabled; // -> true
	 *
	 * Plugin disabled by multiple features:
	 *
	 *		plugin.forceDisabled( 'MyFeature' );
	 *		plugin.forceDisabled( 'OtherFeature' );
	 *		plugin.clearForceDisabled( 'MyFeature' );
	 *		plugin.isEnabled; // -> false
	 *		plugin.clearForceDisabled( 'OtherFeature' );
	 *		plugin.isEnabled; // -> true
	 *
	 * Multiple disabling with the same identifier is redundant:
	 *
	 *		plugin.forceDisabled( 'MyFeature' );
	 *		plugin.forceDisabled( 'MyFeature' );
	 *		plugin.clearForceDisabled( 'MyFeature' );
	 *		plugin.isEnabled; // -> true
	 *
	 * @param {String} id Unique identifier for disabling.
	 * Use the same id when {@link #clearForceDisabled enabling back} the command or plugin.
	 */
	forceDisabled( id ) {
		this._disableStack.add( id );

		if ( this._disableStack.size == 1 ) {
			this.on( 'set:isEnabled', this.forceDisable, { priority: 'highest' } );
			this.isEnabled = false;
		}
	},

	/**
	 * Clears forced disable previously set through {@link #forceDisabled}. See {@link #forceDisabled}.
	 *
	 * @param {String} id Unique identifier, equal to the one passed in {@link #forceDisabled} call.
	 */
	clearForceDisabled( id ) {
		this._disableStack.delete( id );

		if ( this._disableStack.size == 0 ) {
			this.off( 'set:isEnabled', this.forceDisable );

			if ( this instanceof Command ) {
				this.refresh();
			} else if ( this instanceof Plugin ) {
				this.isEnabled = true;
			}
		}
	},

	// Helper function that forces command or plugin to be disabled.
	forceDisable( evt ) {
		evt.return = false;
		evt.stop();
	}
};

export default ForceDisabledMixin;
