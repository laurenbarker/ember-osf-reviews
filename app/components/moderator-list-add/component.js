import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import { task, timeout } from 'ember-concurrency';
import { validator, buildValidations } from 'ember-cp-validations';


const DEBOUNCE_MS = 250;

/* Validations for adding unregistered contributor form.  fullName must be present
and have three letters, and the username (email) must be present and of appropriate format.
*/
const Validations = buildValidations({
    fullName: {
        description: 'Full name',
        validators: [
            validator('presence', true),
            validator('length', {
                min: 3,
            }),
        ],
    },
    email: {
        description: 'Email',
        validators: [
            validator('presence', true),
            validator('format', {
                type: 'email',
                regex: /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
            }),
        ],
    },
});

export default Component.extend(Validations, {
    i18n: service(),
    store: service(),

    selectedUser: '',
    unregisteredUserName: '',
    unregisteredUserEmail: '',
    selectedUnregisteredUser: false,
    roleLabel: 'Role',
    role: '',

    isFormValid: computed.alias('validations.isValid'),

    selectedUserId: computed('selectedUser', 'unregisteredUserEmail', function() {
        return this.get('selectedUser.id') || this.get('unregisteredUserEmail');
    }),

    disableSave: computed('role', 'selectedUser', 'unregisteredUserName', function() {
        return !this.get('role') || (!this.get('selectedUser') && !this.get('unregisteredUserName'));
    }),

    showInviteForm: computed('selectedUser', 'selectedUnregisteredUser', function() {
        return !this.get('selectedUser') && !this.get('selectedUnregisteredUser');
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
        resetInviteForm() {
            this.$('#toggle-form').click();
            this.setProperties({
                unregisteredUserName: '',
                unregisteredUserEmail: '',
            });
        },
        selectUnregistered() {
            if (this.get('isFormValid')) {
                this.$('#toggle-form').click();
                this.set('selectedUnregisteredUser', true);
            }
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
