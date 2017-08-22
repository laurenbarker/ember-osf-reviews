import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),

    showSetup: Ember.computed.notEmpty('providersToSetup'),

    providersToSetup: Ember.computed('model.[]', function() {
        return this.get('model').filter(provider =>
            !provider.get('reviewsWorkflow') && provider.get('permissions').includes('set_up_moderation')
        );
    }),

    showDashboard: Ember.computed('model.[]', function() {
        const providers = this.get('model');
        return providers.any((p) => p.get('reviewsWorkflow'));
    }),

    actions: {
        transitionToDetail(provider, reviewable) {
            this.transitionToRoute('preprints.provider.preprint-detail', provider.get('id'), reviewable.get('id'));
        },
        setupProvider(provider) {
            this.transitionToRoute('preprints.provider.setup', provider.id);
        },
    }
});
