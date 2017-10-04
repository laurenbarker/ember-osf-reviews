import Ember from 'ember';

import OSFAgnosticAuthRouteMixin from 'ember-osf/mixins/osf-agnostic-auth-route';

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class Application Route Handler
 */
export default Ember.Route.extend(OSFAgnosticAuthRouteMixin, {
    i18n: Ember.inject.service(),
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),

    afterModel: function() {
        const availableLocales = this.get('i18n.locales').toArray();
        let locale;

        if (navigator.languages && navigator.languages.length) {
            // Works in Chrome and Firefox (editable in settings)
            for (let lang of navigator.languages) {
                if (availableLocales.includes(lang)) {
                    locale = lang;
                    break;
                }
            }
        } else if (navigator.language && availableLocales.includes(navigator.language)) {
            // Backup for Safari (uses system settings)
            locale = navigator.language;
        }

        if (locale) {
            this.set('i18n.locale', locale);
        }

        // Check permissions
        if (!this.get('session.isAuthenticated')) {
            this.replaceWith('index');
        } else {
            this.get('currentUser.user').then((user) => {
                if (!user.get('canViewReviews')) {
                    this.replaceWith('index');
                }
            });
        }
    }
});
