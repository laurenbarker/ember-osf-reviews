import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import QueryParams from 'ember-parachute';
import { task } from 'ember-concurrency';

import Analytics from 'ember-osf/mixins/analytics';


export const moderatorsQueryParams = new QueryParams({
    page: {
        defaultValue: 1,
        refresh: true,
    },
});

export default Controller.extend(Analytics, moderatorsQueryParams.Mixin, {
    store: service(),
    theme: service(),
    i18n: service(),
    currentUser: service(),

    disableAdminDeletion: false,
    editingModerator: false,
    addingNewContrib: false,
    isAdmin: false,

    actions: {
        pageChanged(page) {
            this.set('page', page);
        },
        newModerator() {
            this.setProperties({
                editingModerator: true,
                addingNewModerator: true,
            });
            if (this.get('page') !== this.get('results.totalPages')) {
                this.set('page', this.get('results.totalPages'));
            }
        },
    },

    setup({ queryParams }) {
        this.set('moderatorIds', []);
        this.set('roleOptions', [
            {
                role: 'admin',
                label: this.get('i18n').t('moderators.admin'),
            },
            {
                role: 'moderator',
                label: this.get('i18n').t('moderators.moderator'),
            },
        ]);
        this.get('fetchAdmin').perform();
        this.get('fetchData').perform(queryParams);
        this.get('loadModerators').perform();
    },

    queryParamsDidChange({ shouldRefresh, queryParams }) {
        if (shouldRefresh) {
            this.get('fetchData').perform(queryParams);
        }
    },

    reset(isExiting) {
        if (isExiting) {
            this.resetQueryParams();
        }
    },

    loadModerators: task(function* () {
        const moderators = yield this.get('store').query('moderator', {
            page: {
                size: 100, // will need to be updated if a provider has > 100 moderators
            },
            provider: this.get('theme.provider.id'),
        });
        const moderatorIds = moderators.map(moderator => moderator.id);
        this.set('moderatorIds', moderatorIds);
    }),

    deleteModerator: task(function* (moderatorInstance) {
        try {
            yield moderatorInstance.destroyRecord({ adapterOptions: { provider: this.get('theme.provider.id') } });
            moderatorInstance.unloadRecord(); // https://github.com/emberjs/data/issues/5014

            const allModerators = this.get('store').peekAll('moderator');

            if (allModerators.get('length') % 10 === 0) {
                if (this.get('page') !== 1) {
                    this.decrementProperty('page');
                } else {
                    yield this.get('fetchData').perform(this.get('queryParams'));
                }
            } else {
                this.get('results.moderators').removeObject(moderatorInstance);
            }

            yield this.get('fetchAdmin').perform();
            return true;
        } catch (e) {
            this.get('toast').error(this.get('i18n').t('moderators.deleteModeratorError'));
            return false;
        } finally {
            this.get('loadModerators').perform();
            this.set('editingModerator', false);
        }
    }),

    updateModerator: task(function* (moderatorInstance, permissionGroup) {
        try {
            moderatorInstance.set('permissionGroup', permissionGroup);

            yield moderatorInstance.save({ adapterOptions: { provider: this.get('theme.provider.id') } });
            yield this.get('fetchAdmin').perform();

            return true;
        } catch (e) {
            this.get('toast').error(this.get('i18n').t('moderators.updateModeratorError'));
            return false;
        } finally {
            this.set('editingModerator', false);
        }
    }),

    addModerator: task(function* (id, permissionGroup, fullName) {
        try {
            let moderatorInstance = {};
            if (fullName) {
                moderatorInstance = yield this.get('store').createRecord('moderator', {
                    permissionGroup,
                    fullName,
                    email: id,
                    // must include provider because ember data doesn't like the url structure
                    provider: this.get('theme.provider.id'),
                });
            } else {
                moderatorInstance = yield this.get('store').createRecord('moderator', {
                    id,
                    permissionGroup,
                    // must include provider because ember data doesn't like the url structure
                    provider: this.get('theme.provider.id'),
                });
            }

            yield moderatorInstance.save();
            yield this.get('fetchAdmin').perform();

            const allModerators = yield this.get('store').peekAll('moderator');
            if (allModerators.get('length') % 10 === 1) {
                yield this.get('fetchData').perform(this.get('queryParams'));
            } else {
                this.get('results.moderators').pushObject(moderatorInstance);
            }
        } catch (e) {
            if (e.errors[0].detail.includes('Specified user is already a moderator')) {
                this.get('toast').error(this.get('i18n').t('moderators.addExistingModeratorError'));
            } else {
                this.get('toast').error(this.get('i18n').t('moderators.addModeratorError'));
            }
        } finally {
            this.get('loadModerators').perform();
            this.setProperties({
                editingModerator: false,
                addingNewModerator: false,
            });
        }
    }),

    fetchAdmin: task(function* () {
        this.set('disableAdminDeletion', true);
        const provider = this.get('theme.provider');
        const admins = yield this.get('store').query('moderator', {
            provider: provider.id,
            // temporary, should be refactored when https://openscience.atlassian.net/browse/EMB-227 is complete
            page: {
                size: 100, // will need to be updated if a provider has > 100 admin moderators
            },
            filter: {
                permission_group: 'admin',
            },
        });

        const adminIds = admins.content.map(admin => admin.id);

        if (adminIds.indexOf(this.get('currentUser.user.id')) > -1) {
            this.set('isAdmin', true);
        } else {
            this.set('isAdmin', false);
        }

        if (admins.meta.total > 1) {
            this.set('disableAdminDeletion', false);
        }
    }),

    fetchData: task(function* (queryParams) {
        const provider = this.get('theme.provider');
        const response = yield this.get('store').query('moderator', {
            provider: provider.id,
            page: queryParams.page,
        });

        this.set('results', {
            moderators: response.toArray(),
            totalPages: Math.ceil(response.meta.total / response.meta.per_page),
        });
    }),
});
