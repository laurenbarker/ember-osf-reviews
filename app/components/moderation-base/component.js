import Ember from 'ember';
/**
 * The base for the provider moderation page (tabs, provider name, and breadcrumbs).
 *
 * Sample usage:
 * ```handlebars
 * {{moderation-base
 *   provider=provider
 *   pendingCount=pendingCount
 * }}
 * ```
 * @class moderation-base
 **/
export default Ember.Component.extend({
    tabs: Ember.computed('pendingCount', function(){
        return [
            {
                nameKey: 'global.moderation',
                route: 'preprints.provider.moderation',
                hasCount: true,
                count: this.get('pendingCount') || 0,
            },
            {
                nameKey: 'global.settings',
                route: 'preprints.provider.settings',
            },
        ];
    }),
});
