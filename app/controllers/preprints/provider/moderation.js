import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: ['page', 'sort', 'status'],
    page: 1,
    status: 'pending',
    sort: '-date_last_transitioned',

    actions: {
        statusChanged(status) {
            this.set('status', status);
            this.set('page', 1);
        },
        pageChanged(page) {
            this.set('page', page);
        },
        sortChanged(sort) {
            this.set('sort', sort);
            this.set('page', 1);
        },
    }
});
