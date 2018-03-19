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

    disableAdminDeletion: false,
    editingModerator: false,
    addingNewContrib: false,

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
        this.set('roleOptions', [
            {
                role: 'admin',
                label: 'Admin',
            },
            {
                role: 'moderator',
                label: 'Moderator',
            },
        ]);
        this.get('fetchData').perform(queryParams);
        this.get('fetchAdmin').perform();
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

    deleteModerator: task(function* (id) {
        try {
            // queryRecord doesn't play nice with the API
            // findRecord with delete won't accept a payload
            const response = yield this.get('store').query('moderator', {
                provider: this.get('theme.provider.id'),
                filter: { id },
            });
            const moderatorInstance = response.get('firstObject');
            moderatorInstance.provider = this.get('theme.provider.id');

            yield moderatorInstance.destroyRecord({ adapterOptions: { provider: this.get('theme.provider.id') } });
            yield this.get('fetchAdmin').perform();
            this.get('results.moderators').popObject(moderatorInstance);
            return true;
        } catch (e) {
            this.get('toast').error(this.get('i18n').t('moderators.deleteModeratorError'));
            return false;
        } finally {
            this.set('editingModerator', false);
        }
    }),

    updateModerator: task(function* (id, permissionGroup) {
        try {
            const moderatorInstance = yield this.get('store').findRecord('moderator', id, {
                // must include provider because ember data doesn't like the url structure
                adapterOptions: {
                    provider: this.get('theme.provider.id'),
                },
            });
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

    addModerator: task(function* (id, permissionGroup) {
        try {
            const moderatorInstance = yield this.get('store').createRecord('moderator', {
                id,
                permissionGroup,
                // must include provider because ember data doesn't like the url structure
                provider: this.get('theme.provider.id'),
            });

            yield moderatorInstance.save();
            yield this.get('fetchAdmin').perform();
            this.get('results.moderators').pushObject(moderatorInstance);
        } catch (e) {
            this.get('toast').error(this.get('i18n').t('moderators.addModeratorError'));
        } finally {
            this.setProperties({
                editingModerator: false,
                addingNewModerator: false,
            });
        }
    }),

    fetchAdmin: task(function* () {
        this.set('disableAdminDeletion', true);
        const provider = this.get('theme.provider');
        const admin = yield this.get('store').query('moderator', {
            provider: provider.id,
            filter: {
                permission_group: 'admin',
            },
        });

        if (admin.meta.total > 1) {
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
