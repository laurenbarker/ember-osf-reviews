import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

/**
 * A feed of recent actions for all providers the user has access to
 *
 * Sample usage:
 * ```handlebars
 * {{action-feed}}
 * ```
 * @class action-feed
 */
export default Ember.Component.extend({
    store: Ember.inject.service(),
    toast: Ember.inject.service(),

    classNames: ['action-feed'],

    errorMessage: t('dashboard.error_loading'),

    moreActions: Ember.computed('totalPages', 'page', function() {
        return this.get('page') < this.get('totalPages');
    }),
});
