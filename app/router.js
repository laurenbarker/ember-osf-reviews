import { computed } from '@ember/object';
import EmberRouter from '@ember/routing/router';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import config from './config/environment';

// Disable the reset scroll behaviour on transitions between the two given routes.
const SCROLL_RESET_DISABLED_ROUTES = ['preprints.provider.moderation', 'preprints.provider.settings'];


const Router = EmberRouter.extend({
    metrics: service(),
    location: config.locationType,
    rootURL: config.rootURL,
    transitioningFrom: '',
    transitioningTo: '',

    disableResetScroll: computed('transitioningFrom', 'transitioningTo', function() {
        return SCROLL_RESET_DISABLED_ROUTES.includes(this.get('transitioningFrom')) &&
            SCROLL_RESET_DISABLED_ROUTES.includes(this.get('transitioningTo'));
    }),

    willTransition(oldInfos, newInfos) {
        this._super(...arguments);
        this.set('transitioningFrom', EmberRouter._routePath(oldInfos));
        this.set('transitioningTo', EmberRouter._routePath(newInfos));
    },

    didTransition() {
        this._super(...arguments);
        this._trackPage();
        if (!this.get('disableResetScroll')) {
            window.scrollTo(0, 0);
        }
    },

    // Track page/route views
    _trackPage() {
        scheduleOnce('afterRender', this, () => {
            const page = document.location.pathname;
            const routeName = this.getWithDefault('currentRouteName', 'unknown');
            this.get('metrics').trackPage({ page, routeName });
        });
    },

});

/* eslint-disable array-callback-return */

Router.map(function() {
    this.route('page-not-found', { path: '/*bad_url' });

    this.route('preprints', function() {
        this.route('page-not-found', { path: '/' });
        this.route('provider', { path: ':provider_id' }, function() {
            this.route('setup');
            this.route('moderation', { path: '/' });
            this.route('moderators');
            this.route('settings');
            this.route('preprint-detail', { path: ':preprint_id' });
            this.route('notifications');
        });
    });
    this.route('dashboard');
    this.route('page-not-found');
    this.route('forbidden');
});

/* eslint-enable array-callback-return */

export default Router;
