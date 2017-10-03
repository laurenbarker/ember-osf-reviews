import Ember from 'ember';

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class Provider Route Handler
 */
export default Ember.Route.extend({
    theme: Ember.inject.service(),
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),

    beforeModel() {
        if (!this.get('session.isAuthenticated')) {
            this.replaceWith('not-authenticated');
        } else {
            this.get('currentUser.user').then((user) => {
                if (!user.get('canViewReviews')) {
                    this.replaceWith('forbidden');
                }
            });
        }
    },

    model(params) {
        return this.get('theme').loadProvider(params.provider_id).catch(() => {
            this.replaceWith('page-not-found')
        });
    },

    afterModel(model, transition) {
        if (!model.get('permissions').contains('view_submissions')) {
            this.replaceWith('forbidden');
        } else if (!model.get('reviewsWorkflow') && transition.targetName !== 'preprints.provider.setup') {
            return this.replaceWith('preprints.provider.setup', model);
        }
    },
});
