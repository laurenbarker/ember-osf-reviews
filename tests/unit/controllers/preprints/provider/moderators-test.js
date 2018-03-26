import { moduleFor, test } from 'ember-qunit';


moduleFor('controller:preprints/provider/moderators', 'Unit | Controller | preprints/provider/moderators', {
    // Specify the other units that are required for this test.
    needs: [
        'service:theme',
        'service:currentUser',
        'service:metrics',
        'service:i18n',
    ],
});

test('Initial properties', function (assert) {
    const ctrl = this.subject();

    const expected = {
        page: 1,
    };

    const propKeys = Object.keys(expected);
    const actual = ctrl.getProperties(propKeys);

    assert.ok(propKeys.every(key => expected[key] === actual[key]));
});

test('pageChange action', function (assert) {
    const ctrl = this.subject();
    ctrl.set('page', 2);

    ctrl.send('pageChanged', 1);

    assert.strictEqual(ctrl.get('page'), 1);
});

test('newModerator action', function (assert) {
    const ctrl = this.subject();
    ctrl.set('page', 1);
    ctrl.set('results', { totalPages: 2 });
    ctrl.set('editingModerator', false);
    ctrl.set('addingNewModerator', false);

    ctrl.send('newModerator');

    assert.strictEqual(ctrl.get('page'), 2);
    assert.strictEqual(ctrl.get('editingModerator'), true);
    assert.strictEqual(ctrl.get('addingNewModerator'), true);
});

test('Reset properties', function (assert) {
    const ctrl = this.subject();

    const expected = {
        page: 1,
    };

    ctrl.setProperties({
        page: 2,
    });

    ctrl.reset(true);

    const propKeys = Object.keys(expected);
    const actual = ctrl.getProperties(propKeys);

    assert.ok(propKeys.every(key => expected[key] === actual[key]));
});
