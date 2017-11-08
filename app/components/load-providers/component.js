import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
    store: service(),

    showDashboard: computed('providers.[]', 'getProviders.isRunning', function() {
        const providers = this.get('providers');
        return providers.any(p => p.get('reviewsWorkflow'));
    }),

    providersToSetup: computed('providers.[]', 'getProviders.isRunning', function() {
        return this.get('providers').filter(provider =>
            !provider.get('reviewsWorkflow') && provider.get('permissions').includes('set_up_moderation'));
    }),

    sidebarProviders: computed('providers.[]', 'getProviders.isRunning', function() {
        return this.get('providers').filter(provider =>
            provider.get('reviewsWorkflow') || provider.get('permissions').includes('set_up_moderation'));
    }),

    init() {
        this._super(...arguments);
        this.setProperties({
            providers: [],
            query: {
                'filter[permissions]': 'view_actions,set_up_moderation',
            },
        });
    },

    didReceiveAttrs() {
        this.get('getProviders').perform(this.get('query'));
    },

    getProviders: task(function* (query) {
        const results = yield this.get('store').query('preprint-provider', query);
        return this.set('providers', results);
    }).restartable(),
});
