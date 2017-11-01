import Object from '@ember/object';
import latestAction from 'reviews/utils/latest-action';
import { module, test } from 'qunit';

module('Unit | Utility | latest action');

test('get first action - 2 actions', function(assert) {
    const firstAction = Object.create({ dateModified: '2017-11-01T22:19:40.556278Z' });
    const lastAction = Object.create({ dateModified: '2017-11-01T22:17:40.556278Z' });
    const actions = [firstAction, lastAction];

    const result = latestAction(actions);
    assert.equal(result, firstAction);
});

test('get last action - 2 actions', function(assert) {
    const firstAction = Object.create({ dateModified: '2017-11-01T22:17:40.556278Z' });
    const lastAction = Object.create({ dateModified: '2017-11-01T22:19:40.556278Z' });
    const actions = [firstAction, lastAction];

    const result = latestAction(actions);
    assert.equal(result, lastAction);
});

test('get first action - 1 actions', function(assert) {
    const firstAction = Object.create({ dateModified: '2017-11-01T22:19:40.556278Z' });
    const actions = [firstAction];

    const result = latestAction(actions);
    assert.equal(result, firstAction);
});

test('handle no actions - 0 actions', function(assert) {
    const result = latestAction([]);
    assert.equal(result, null);
});
