import { isArray } from '@ember/array';
import Route from '@ember/routing/route';


export default Route.extend({

    model(params) {
        return params.preprint_id;
    },

    setupController(controller, model) {
        this._super(...arguments);
        controller.get('fetchData').perform(model);
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

    actions: {
        error(error) {
            if (error && error.errors && isArray(error.errors)) {
                return this.intermediateTransitionTo('page-not-found');
            }
        },
    },
});
