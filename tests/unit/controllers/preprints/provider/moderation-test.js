import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:preprints/provider/moderation', 'Unit | Controller | preprints/provider/moderation', {
  // Specify the other units that are required for this test.
  needs: [
    'service:theme',
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
