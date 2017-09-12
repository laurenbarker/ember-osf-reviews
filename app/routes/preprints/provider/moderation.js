import Ember from 'ember';

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class provider Route Handler
 */
export default Ember.Route.extend({
    theme: Ember.inject.service(),

    queryParams: {
        sort: { refreshModel: true },
        status: { refreshModel: true },
        provider: { refreshModel: true },
        page: { refreshModel: true }
    },

    model(params) {
        return this.store.query('preprint', {
            'filter[reviews_state]': params.status || 'pending',
            'filter[provider]': params.provider || this.get('theme.provider.id'),
            sort: params.sort,
            page: params.page
        }).then((results) => {
            return {
                submissions: results,
                meta: results.get('meta')
            };
        });
    },

    setupController(controller, { submissions, meta }) {
        this._super(controller, submissions);
        controller.set('meta', meta);

        // reviewableCounts is undefined on page transitions if computed in the controller
        controller.set(
            'statusCounts',
            this.controllerFor('preprints.provider').get('statusCounts')
        );
    },

    actions: {
        loading(transition, originRoute) {
            let controller = this.controllerFor('preprints.provider.moderation');
            controller.set('loading', true);
            transition.promise.finally(function() {
                controller.set('loading', false);
            });
        },
    }
});
