import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import { task } from 'ember-concurrency';


export default Component.extend({
    i18n: service(),
    store: service(),

    removeConfirmation: false,
    editConfirmation: false,
    roleLabel: 'Role',
    role: computed('moderator.permissionGroup', function() {
        for (const value of this.get('roleOptions')) {
            if (value.role === this.get('moderator.permissionGroup')) {
                this.set('roleLabel', value.label);
            }
        }
        return this.get('moderator.permissionGroup');
    }),

    disableRemove: computed('role', 'disableAdminDeletion', 'editingModerator', function() {
        return (this.get('role') === 'admin' && this.get('disableAdminDeletion')) || this.get('editingModerator');
    }),

    didReceiveAttrs() {
        this.get('fetchData').perform();
    },

    actions: {
        roleChanged(role) {
            this.setProperties({
                editingModerator: true,
                editConfirmation: true,
            });
            this._setRole(role);
        },
        removeInitiated() {
            this.setProperties({
                editingModerator: true,
                removeConfirmation: true,
            });
        },
        cancel() {
            this._setRole(this.get('moderator.permissionGroup'));
            this.setProperties({
                editingModerator: false,
                removeConfirmation: false,
                editConfirmation: false,
            });
        },
    },

    _setRole(role) {
        this.set('role', role);
        for (const value of this.get('roleOptions')) {
            if (value.role === role) {
                this.set('roleLabel', value.label);
            }
        }
    },

    removeModerator: task(function* (moderatorId) {
        const removed = yield this.get('deleteModerator').perform(moderatorId);
        if (removed) {
            this.set('removeConfirmation', false);
        }
    }),

    editModerator: task(function* (moderatorId, permissionGroup) {
        const saved = yield this.get('updateModerator').perform(moderatorId, permissionGroup);
        if (saved) {
            this.set('editConfirmation', false);
        }
    }),

    fetchData: task(function* () {
        const moderatorId = this.get('moderator.id');
        const response = yield this.get('store').findRecord('user', moderatorId);
        this.set('user', response);
    }),
});
