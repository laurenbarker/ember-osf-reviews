import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { oneWay } from '@ember/object/computed';

import { task } from 'ember-concurrency';


export default Component.extend({
    i18n: service(),
    store: service(),

    removeConfirmation: false,
    editConfirmation: false,
    role: oneWay('moderator.permissionGroup'),
    roleLabel: computed('role', function() {
        return this.get('roleOptions').findBy('role', this.get('role')).label;
    }),

    disableRemove: computed('role', 'disableAdminDeletion', 'editingModerator', function() {
        return (this.get('role') === 'admin' && this.get('disableAdminDeletion')) || this.get('editingModerator');
    }),

    disableRoleSelect: computed('disableRemove', 'editConfirmation', function() {
        return this.get('disableRemove') && !this.get('editConfirmation');
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
            this.set('role', role);
        },
        removeInitiated() {
            this.setProperties({
                editingModerator: true,
                removeConfirmation: true,
            });
        },
        cancel() {
            this.set('role', this.get('moderator.permissionGroup'));
            this.setProperties({
                editingModerator: false,
                removeConfirmation: false,
                editConfirmation: false,
            });
        },
    },

    editModerator: task(function* (moderator, permissionGroup) {
        const saved = yield this.get('updateModerator').perform(moderator, permissionGroup);
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
