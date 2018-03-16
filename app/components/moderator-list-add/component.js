import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import { task, timeout } from 'ember-concurrency';


const DEBOUNCE_MS = 250;

export default Component.extend({
    i18n: service(),
    store: service(),

    selectedUser: '',
    roleLabel: 'Role',
    role: '',

    disableSave: computed('role', 'selectedUser', function() {
        return !this.get('role') || !this.get('selectedUser');
    }),

    actions: {
        roleChanged(role) {
            this.set('role', role);
            for (const value of this.get('roleOptions')) {
                if (value.role === role) {
                    this.set('roleLabel', value.label);
                }
            }
        },
        cancel() {
            this.setProperties({
                editingModerator: false,
                addingNewModerator: false,
                role: '',
                selectedUser: '',
            });
        },
    },

    searchUsers: task(function* (query) {
        yield timeout(DEBOUNCE_MS);
        try {
            const users = yield this.get('store').query('user', {
                filter: {
                    'full_name,given_name,middle_names,family_name': query,
                },
                size: 20,
            });
            return users;
        } catch (e) {
            this.get('toast').error(this.get('i18n').t('submit.search_contributors_error'));
        }
    }).restartable(),
});
