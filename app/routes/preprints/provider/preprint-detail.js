import { isArray } from '@ember/array';
import $ from 'jquery';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
    theme: service(),
    currentUser: service(),

    model(params) {
        return this.store.findRecord(
            'preprint',
            params.preprint_id,
            { include: ['node', 'license', 'actions'], reload: true },
        );
    },

    afterModel(model) {
        return model.get('node').then(this._checkNodePublic.bind(this));
    },

    setupController() {
        scheduleOnce('afterRender', this, function() {
            if (!MathJax) return;
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, [$('.abstract')[0], $('#preprintTitle')[0]]]);
        });

        return this._super(...arguments);
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

    _checkNodePublic(node) {
        if (!node.get('public')) {
            this.transitionTo('page-not-found');
        }
    },
});
