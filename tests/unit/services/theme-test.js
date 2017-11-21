import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import { moduleFor, test } from 'ember-qunit';

import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';


moduleFor('service:theme', 'Unit | Service | theme', {
    needs: [
        'service:i18n',
        'locale:en/translations',
        'locale:en/config',
        'util:i18n/missing-message',
        'util:i18n/compile-template',
        'config:environment',
        'service:store',
    ],
    beforeEach() {
        // set the locale and the config
        getOwner(this).lookup('service:i18n').set('locale', 'en');
        this.register('locale:xy/config', localeConfig);

        // register t helper
        this.register('helper:t', tHelper);
    },
});

test('_onProviderLoad', function(assert) {
    const service = this.subject();
    const fakeProvider = EmberObject.create({
        reviewableStatusCounts: {
            pending: 2,
            accepted: 1,
            rejected: 3,
            initial: 0,
        },
        id: 'OSF',
        name: 'Open Science Framework',
        preprintWord: 'preprint',
        domian: '',
    });

    assert.strictEqual(service.provider, null);
    assert.strictEqual(service.reviewableStatusCounts, null);

    service._onProviderLoad(fakeProvider);
    assert.strictEqual(fakeProvider.get('id'), service.get('id'));
    assert.strictEqual(fakeProvider.get('reviewableStatusCounts'), service.get('reviewableStatusCounts'));
});
