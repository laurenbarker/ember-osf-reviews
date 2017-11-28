import { filterBy } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

import { task } from 'ember-concurrency';


export default Component.extend({
    store: service(),

    tagName: 'ul',
    node: null,
    page: 1,

    bibliographicContributors: filterBy('contributors', 'bibliographic', true),

    init() {
        this._super(...arguments);
        this.set('contributorsList', this.get('contributors') || []);
        if (!this.get('contributors.length') || this.get('contributors.content.meta.total') > this.get('contributors.content.meta.per_page')) {
            this.get('fetchData').perform();
        }
    },

    fetchData: task(function* () {
        const node = this.get('node.content');
        const query = {
            'page[size]': 100,
            page: this.get('page'),
        };

        let response = yield this.get('loadContributors').perform(node, query);

        while (response.links.next) {
            query.page = this.incrementProperty('page');
            response = yield this.get('loadContributors').perform(node, query);
        }
        this.set('contributors', this.get('contributorsList'));
    }),

    loadContributors: task(function* (node, query) {
        const results = yield this.get('store').queryHasMany(node, 'contributors', query);
        this.get('contributorsList').pushObjects(results.toArray());
        return results;
    }),
});
