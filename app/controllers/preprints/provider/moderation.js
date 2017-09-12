import Ember from 'ember';

export default Ember.Controller.extend({
    theme: Ember.inject.service(),
    store: Ember.inject.service(),

    queryParams: ['page', 'sort', 'status', 'provider'],
    page: 1,
    status: 'pending',
    sort: 'date_created',
    provider: Ember.computed('theme.provider.id', function() {
        return this.get('theme.provider.id');
    }),

    actions: {
        statusFilterChanged(status) {
            this.set('status', status);
            this.set('page', 1);
        },
        pageChanged(page) {
            this.set('page', page);
        },
        sortChanged(sort) {
            this.set('sort', sort);
            this.set('page', 1);
        }
    }
});
