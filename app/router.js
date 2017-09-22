import Ember from 'ember';
import config from './config/environment';

// Disable the reset scroll behaviour on transitions between the two given routes.
const SCROLL_RESET_DISABLED_ROUTES = ['preprints.provider.moderation', 'preprints.provider.settings'];

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL,
    willTransition(oldInfos, newInfos) {
        this._super(...arguments);
        const oldRoute = Ember.Router._routePath(oldInfos);
        const newRoute = Ember.Router._routePath(newInfos);
        const disableResetScroll = SCROLL_RESET_DISABLED_ROUTES.includes(oldRoute) && SCROLL_RESET_DISABLED_ROUTES.includes(newRoute);
        if (!disableResetScroll) {
            window.scrollTo(0, 0);
        }
    }
});

Router.map(function() {
    this.route('page-not-found', {path: '/*bad_url'});

    this.route('preprints', function() {
        this.route('page-not-found', { path: '/' });
        this.route('provider', {path: ':provider_id'}, function() {
            this.route('setup');
            this.route('moderation', {path: '/'});
            this.route('settings');
            this.route('preprint-detail', {path:':preprint_id'});
        });
    });
    this.route('dashboard');
    this.route('page-not-found');
    this.route('not-authenticated');
    this.route('forbidden');
});

export default Router;
