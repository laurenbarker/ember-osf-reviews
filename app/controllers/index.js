import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
    session: service(),
    currentUser: service(),

    modelName: 'preprint-provider',
    query: {
        'filter[permissions]': 'view_actions,set_up_moderation',
    },
    data: [],

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

    actions: {
        transitionToDetail(provider, reviewable) {
            this.transitionToRoute('preprints.provider.preprint-detail', provider.get('id'), reviewable.get('id'));
        },
        setupProvider(provider) {
            this.transitionToRoute('preprints.provider.setup', provider.id);
        },
    },

    init() {
        this._super(...arguments);
        this.get('fetchData').perform();
    },

    fetchData: task(function* () {
        const results = yield this.get('store')
            .query(this.get('modelName'), this.get('query'));
        this.set('data', results);
    }).restartable(),
});
