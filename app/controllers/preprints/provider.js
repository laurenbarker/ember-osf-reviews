import Ember from 'ember';

export default Ember.Controller.extend({
    theme: Ember.inject.service(),

    pendingCount: Ember.computed('theme', function () {
        return this.get('theme.provider.reviewableStatusCounts.pending');
    }),

    statusCounts: Ember.computed('theme', function () {
        return {
            pending: this.get('theme.provider.reviewableStatusCounts.pending'),
            accepted: this.get('theme.provider.reviewableStatusCounts.accepted'),
            rejected: this.get('theme.provider.reviewableStatusCounts.rejected')
        }
    }),
});
