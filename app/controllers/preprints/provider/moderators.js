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
        this.get('fetchAdmin').perform(queryParams);
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

    saveModerator: task(function* (fullName, permissionGroup) {
        try {
            const moderatorInstance = yield this.get('store').createRecord('moderator', {
                fullName,
                permissionGroup,
            });

            yield moderatorInstance.save();
            this.get('results.moderators').pushObject(moderatorInstance);
        } catch (e) {
            this.get('toast').error(this.get('i18n').t('components.preprintStatusBanner.error'));
        } finally {
            this.setProperties({
                editingModerator: false,
                addingNewModerator: false,
            });
        }
    }),

    fetchAdmin: task(function* () {
        const provider = this.get('theme.provider');
        const admin = yield this.get('store').query('moderator', {
            provider: provider.id,
            filter: {
                permission_group: 'admin',
            },
        });

        if (admin.meta.total <= 1) {
            this.set('disableAdminDeletion', true);
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
