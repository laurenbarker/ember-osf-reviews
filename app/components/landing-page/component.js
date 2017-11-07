import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';


export default Component.extend({
    store: service(),
    session: service(),
    currentUser: service(),

    showSetup: notEmpty('providersToSetup'),

    showDashboard: computed('data.[]', 'fetchData.isRunning', function() {
        const providers = this.get('data');
        return providers.any(p => p.get('reviewsWorkflow'));
    }),

    providersToSetup: computed('data.[]', 'fetchData.isRunning', function() {
        return this.get('data').filter(provider =>
            !provider.get('reviewsWorkflow') && provider.get('permissions').includes('set_up_moderation'));
    }),

    sidebarProviders: computed('data.[]', 'fetchData.isRunning', function() {
        return this.get('data').filter(provider =>
            provider.get('reviewsWorkflow') || provider.get('permissions').includes('set_up_moderation'));
    }),

    init() {
        this._super(...arguments);
        this.setProperties({
            data: [],
            query: {
                'filter[permissions]': 'view_actions,set_up_moderation',
            },
        });
        this.get('fetchData').perform();
    },

    actions: {
        transitionToDetail(provider, reviewable) {
            this.transitionToRoute('preprints.provider.preprint-detail', provider.get('id'), reviewable.get('id'));
        },
        setupProvider(provider) {
            this.transitionToRoute('preprints.provider.setup', provider.id);
        },
    },

    fetchData: task(function* () {
        const results = yield this.get('store')
            .query('preprint-provider', this.get('query'));
        this.set('data', results);
    }),
});
