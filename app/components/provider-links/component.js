import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
    store: service(),
    theme: service(),

    tagName: 'ul',
    classNames: ['fa-ul'],

    init() {
        this._super(...arguments);
        this.iconMap = {
            preprint: 'fa-graduation-cap',
            paper: 'fa-file-text-o',
            thesis: 'fa-book',
        };
        this.pendingCount = null;
        this.get('fetchData').perform();
    },

    fetchData: task(function* () {
        const provider = yield this.get('theme').loadProvider(this.get('provider.id'));
        const results = yield this.get('store').queryHasMany(provider, 'preprints', {
            'meta[reviews_state_counts]': true,
        });
        this.set('pendingCount', results.meta.reviews_state_counts.pending);
    }),
});
