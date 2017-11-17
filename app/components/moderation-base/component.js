import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import { task } from 'ember-concurrency';
/**
 * The base for the provider moderation page (tabs, provider name, and breadcrumbs).
 *
 * Sample usage:
 * ```handlebars
 * {{moderation-base}}
 * ```
 * @class moderation-base
 * */
export default Component.extend({
    theme: service(),
    store: service(),

    tabs: computed('pendingCount', function() {
        return [
            {
                nameKey: 'global.moderation',
                route: 'preprints.provider.moderation',
                hasCount: true,
                count: this.get('pendingCount'),
            },
            {
                nameKey: 'global.settings',
                route: 'preprints.provider.settings',
            },
        ];
    }),

    init() {
        this._super(...arguments);
        this.pendingCount = this.get('theme.provider.reviewableStatusCounts.pending');
        this.providerName = this.get('theme.provider.name');
        this.get('fetchData').perform();
    },

    fetchData: task(function* () {
        try {
            const response = yield this.get('store').findRecord(
                'preprint-provider',
                this.get('theme.id'), {
                    adapterOptions: {
                        query: { related_counts: true },
                    },
                    reload: true,
                },
            );
            this.set('pendingCount', response.get('reviewableStatusCounts.pending'));
        } catch (e) {
            this.transitionToRoute('page-not-found');
        }
    }),
});
