import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),

    queryParams: ['page'],
    page: 1,

    showSetup: Ember.computed.notEmpty('providersToSetup'),

    providersToSetup: Ember.computed('model.providers.[]', function() {
        return this.get('model.providers').filter(provider =>
            !provider.get('reviewsWorkflow') && provider.get('permissions').includes('set_up_moderation')
        );
    }),

    showDashboard: Ember.computed('model.providers.[]', function() {
        const providers = this.get('model.providers');
        return providers.any((p) => p.get('reviewsWorkflow'));
    }),

    actions: {
        transitionToDetail(provider, reviewable) {
            this.transitionToRoute('preprints.provider.preprint-detail', provider.get('id'), reviewable.get('id'));
        },
        setupProvider(provider) {
            this.transitionToRoute('preprints.provider.setup', provider.id);
        },
        pageChanged() {
            this.incrementProperty('page');
        }
    }
});
