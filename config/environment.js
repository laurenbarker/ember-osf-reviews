/* jshint node: true */

module.exports = function(environment) {
    var authorizationType = 'cookie';

    var ENV = {
        modulePrefix: 'reviews',
        appName: 'Reviews',
        environment: environment,
        rootURL: '/reviews/',
        locationType: 'auto',
        authorizationType: authorizationType,
        sentryDSN: 'http://test@localhost/80' || process.env.SENTRY_DSN,
        'ember-simple-auth': {
            authorizer: `authorizer:osf-${authorizationType}`,
            authenticator: `authenticator:osf-${authorizationType}`
        },
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },
        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },
        SHARE: {
            baseUrl: process.env.SHARE_BASE_URL || 'https://staging-share.osf.io/',
            searchUrl: process.env.SHARE_SEARCH_URL || 'https://staging-share.osf.io/api/v2/search/creativeworks/_search'
        },
        moment: {
            outputFormat: 'YYYY-MM-DD hh:mm a'
        },
        Reviews: {
            defaultProvider: 'osf',
            i18n: {
                defaultLocale: 'en'
            },
        },
        providers: [
            // OSF must be the first provider
            {
                id: 'osf',
                logoSharing: {
                    path: '/assets/img/provider_logos/osf-dark.png',
                    type: 'image/png',
                    width: 363,
                    height: 242
                }
            }
        ],
        i18n: {
            defaultLocale: 'en'
        },
        metricsAdapters: [
            {
                name: 'GoogleAnalytics',
                environments: ['all'],
                config: {
                    id: process.env.GOOGLE_ANALYTICS_ID
                }
            }
        ],
        FB_APP_ID: process.env.FB_APP_ID,
    };

    if (environment === 'development') {

    }

    if (environment === 'test') {

    }

    if (environment === 'production') {

    } else {

    }

    return ENV;
};
