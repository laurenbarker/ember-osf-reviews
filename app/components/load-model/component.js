import Ember from 'ember';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

const { Component, get, set } = Ember;

export default Component.extend({
    store: service(),

    tagName: '',
    init() {
        this._super(...arguments);
        this.data = [];
    },

    didReceiveAttrs() {
        const query = get(this, 'query');
        const model = get(this, 'model');
        get(this, 'fetchData').perform(model, query);
    },

    fetchData: task(function* (model, query) {
        yield timeout(1000);
        const results = yield get(this, 'store').query(model, query);
        return set(this, 'data', results);
    }).restartable(),
});
