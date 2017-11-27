import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

/**
 * The base for the provider moderation page (tabs, provider name, and breadcrumbs).
 *
 * Sample usage:
 * ```handlebars
 * {{moderation-base}}
 * ```
 * @class moderation-base
 * */
export default Component.extend({
    theme: service(),
    store: service(),

    providerName: alias('theme.provider.name'),

    tabs: computed('theme.reviewableStatusCounts.pending', function() {
        return [
            {
                nameKey: 'global.moderation',
                route: 'preprints.provider.moderation',
                hasCount: true,
                count: this.get('theme.reviewableStatusCounts.pending'),
            },
            {
                nameKey: 'global.settings',
                route: 'preprints.provider.settings',
            },
        ];
    }),
});
