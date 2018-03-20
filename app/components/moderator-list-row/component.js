import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import { task } from 'ember-concurrency';


export default Component.extend({
    i18n: service(),
    store: service(),

    showConfirmation: false,

    role: computed('moderator.permissionGroup', 'roleOptions', function() {
        for (const value of this.get('roleOptions')) {
            if (value.role === this.get('moderator.permissionGroup')) {
                return value.label;
            }
        }
        return 'Role';
    }),

    disableRemove: computed('role', 'disableAdminDeletion', 'editingModerator', function() {
        return (this.get('role') === 'Admin' && this.get('disableAdminDeletion')) || this.get('editingModerator');
    }),

    didReceiveAttrs() {
        this.get('fetchData').perform();
    },

    actions: {
        roleChanged(role) {
            this.set('role', role);
        },
        removeModerator() {
            this.setProperties({
                editingModerator: true,
                showConfirmation: true,
            });
        },
        cancel() {
            this.setProperties({
                editingModerator: false,
                showConfirmation: false,
            });
        },
    },

    fetchData: task(function* () {
        const moderatorId = this.get('moderator.id');
        const response = yield this.get('store').findRecord('user', moderatorId);
        this.set('user', response);
    }),
});
