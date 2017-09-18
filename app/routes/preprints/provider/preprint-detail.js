import Ember from 'ember';

export default Ember.Route.extend({
    theme: Ember.inject.service(),
    currentUser: Ember.inject.service(),

    model(params) {
        return this.store.findRecord('preprint', params.preprint_id, {include: ['node', 'provider', 'license', 'actions']});
    },

    renderTemplate(controller, model) {
        // We're a special page.
        // Render into the applications outlet rather than the `provider` outlet.
        this.render(this.routeName, {
            controller,
            into: 'application',
            model,
        });
    },

    setupController() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            if (!MathJax) return;
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, [Ember.$('.abstract')[0], Ember.$('#preprintTitle')[0]]]);  // jshint ignore:line
        });

        return this._super(...arguments);
    },

    actions: {
        error(error) {
            if (error && error.errors && Ember.isArray(error.errors)) {
                return this.intermediateTransitionTo('page-not-found');
            }
        },
    }
});
