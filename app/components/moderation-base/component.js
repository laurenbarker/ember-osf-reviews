import Ember from 'ember';
/**
 * The base for the provider moderation page (tabs, provider name, and breadcrumbs).
 *
 * Sample usage:
 * ```handlebars
 * {{moderation-base
 *    active='Settings'
 * }}
 * ```
 * @class moderation-base
 **/
export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    theme: Ember.inject.service(),

    tabs: Ember.computed('i18n.locale', function(){
        const i18n = this.get('i18n');
        return [
            { id: 1, name: i18n.t('global.moderation'), route: 'preprints.provider.moderation'},
            { id: 2, name: i18n.t('global.settings'), route: 'preprints.provider.settings'},
        ];
    }),

    actions: {
        toggleTab: function () {
            if (this.get('active') == 'Moderation'){
                this.set('active', 'Settings');
            } else {
                this.set('active', 'Moderation');
            }
        }
    }
});
