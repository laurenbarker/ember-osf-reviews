import Ember from 'ember';

export default Ember.Route.extend({
    afterModel(model/*, transition */) {
        if (!model.get('permissions').contains('set_up_moderation')) {
            this.replaceWith('forbidden');
        } else if (model.get('reviewsWorkflow')) {
            this.replaceWith('preprints.provider', model);
        }
    },
    renderTemplate(controller, model) {
        // We're a special page.
        // Render into the applications outlet rather than the `provider` outlet.
        this.render(this.routeName, {
            controller: controller,
            into: 'application',
            model: model,
        });
    },
});
