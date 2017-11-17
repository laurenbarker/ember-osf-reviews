import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class Provider Route Handler
 */
export default Route.extend({
    theme: service(),

    model(params) {
        // need to load the provider here so theme can be used in child routes
        return this.get('theme').loadProvider(params.provider_id)
            .catch(() => this.replaceWith('page-not-found'));
    },

    afterModel(model, transition) {
        if (!model.get('permissions').includes('view_submissions')) {
            this.replaceWith('forbidden');
        } else if (!model.get('reviewsWorkflow') && transition.targetName !== 'preprints.provider.setup') {
            this.replaceWith('preprints.provider.setup', model);
        }
    },
});
