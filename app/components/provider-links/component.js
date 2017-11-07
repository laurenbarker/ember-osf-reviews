import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
    store: service(),

    init() {
        this._super(...arguments);
        this.reviewsStateCounts = null;
        this.get('fetchData').perform();
    },

    fetchData: task(function* () {
        const provider = this.get('store').findRecord('preprint-provider', this.get('provider.id'));
        console.log(provider)
        const results = yield this.get('store').queryHasMany(provider, 'preprints', {
            'meta[reviews_state_counts]': true,
        })
        this.set('reviewsStateCounts', results.meta);
    }),
});
