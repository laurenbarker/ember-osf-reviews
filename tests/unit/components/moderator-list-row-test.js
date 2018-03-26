import { run } from '@ember/runloop';

import { moduleForComponent, test } from 'ember-qunit';


moduleForComponent('moderator-list-row', 'Unit | Component | moderator list row', {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true,
    needs: [
        'model:user',
        'service:i18n',
        'service:metrics',
    ],
});

test('roleChanged action', function (assert) {
    this.inject.service('store');
    const component = this.subject({ moderator: { id: 12345 } });

    run(() => {
        component.set('role', 'admin');
        component.set('editingModerator', false);
        component.set('editConfirmation', false);

        component.send('roleChanged', 'moderator');

        assert.strictEqual(component.get('role'), 'moderator');
        assert.strictEqual(component.get('editingModerator'), true);
        assert.strictEqual(component.get('editConfirmation'), true);
    });
});

test('removeInitiated action', function (assert) {
    this.inject.service('store');
    const component = this.subject({ moderator: { id: 12345 } });

    run(() => {
        component.set('editingModerator', false);
        component.set('removeConfirmation', false);

        component.send('removeInitiated');

        assert.strictEqual(component.get('editingModerator'), true);
        assert.strictEqual(component.get('removeConfirmation'), true);
    });
});

test('cancel action', function (assert) {
    this.inject.service('store');
    const component = this.subject({ moderator: { id: 12345 } });

    run(() => {
        component.set('moderator.permissionGroup', 'admin');
        component.set('role', 'moderator');
        component.set('editingModerator', true);
        component.set('removeConfirmation', true);
        component.set('editConfirmation', true);

        component.send('cancel');

        assert.strictEqual(component.get('role'), 'admin');
        assert.strictEqual(component.get('editingModerator'), false);
        assert.strictEqual(component.get('removeConfirmation'), false);
        assert.strictEqual(component.get('editConfirmation'), false);
    });
});
