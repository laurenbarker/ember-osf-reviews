import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class provider Route Handler
 */
export default Route.extend({
    theme: service(),
    store: service(),

    queryParams: {
        sort: { refreshModel: true },
        status: { refreshModel: true },
        page: { refreshModel: true },
    },

    model(params) {
        const provider = this.modelFor('preprints.provider');
        return this.get('store').queryHasMany(provider, 'preprints', {
            filter: {
                reviews_state: params.status,
                node_is_public: true,
            },
            'meta[reviews_state_counts]': true,
            sort: params.sort,
            page: params.page,
        }).then(this._resolveModel.bind(this));
    },

    setupController(controller, model) {
        this._super(controller, model);
        this.controllerFor('preprints.provider').set('pendingCount', model.statusCounts.pending);
        controller.set('loading', false);
    },

    actions: {
        loading(transition) {
            const controller = this.controllerFor('preprints.provider.moderation');
            controller.set('loading', true);
            transition.promise.finally(function() {
                controller.set('loading', false);
            });
        },
    },

    _resolveModel(response) {
        return {
            submissions: response.toArray(),
            totalPages: Math.ceil(response.meta.total / response.meta.per_page),
            statusCounts: response.meta.reviews_state_counts,
        };
    },
});
