import Ember from 'ember';

export default Ember.Route.extend({
    currentUser: Ember.inject.service(),
    session: Ember.inject.service(),
    store: Ember.inject.service(),

    queryParams: {
        page: { refreshModel: true }
    },

    model(params) {
        const emptyModels = {
            providers: [],
            user: []
        };

        if (!this.get('session.isAuthenticated')) {
            return emptyModels;
        }
        return Ember.RSVP.hash({
            providers: this.get('store').query('preprint-provider', {
                'filter[permissions]': 'view_actions,set_up_moderation'
            }),
            actionsList: this.get('store').findRecord('user', this.get('currentUser.currentUserId'))
            .then(user => {
                return user.query('actions', { page: params.page, include: 'target,provider' });
            })
        }).catch(() => {
             return emptyModels;
        });  // On any error, assume no permissions to anything.
    },
});
