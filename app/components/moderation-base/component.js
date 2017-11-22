import { computed } from '@ember/object';
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

    didReceiveAttrs() {
        this.set('providerName', this.get('theme.provider.name'));
    },
});
