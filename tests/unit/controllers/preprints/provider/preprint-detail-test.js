import { run } from '@ember/runloop';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

moduleFor('controller:preprints/provider/preprint-detail', 'Unit | Controller | preprints/provider/preprint-detail', {
    needs: [
        'model:action',
        'model:file',
        'model:file-version',
        'model:comment',
        'model:node',
        'model:preprint',
        'model:preprint-provider',
        'model:institution',
        'model:contributor',
        'model:file-provider',
        'model:registration',
        'model:draft-registration',
        'model:log',
        'model:user',
        'model:citation',
        'model:license',
        'model:wiki',
        'service:metrics',
        'service:theme',
        'service:currentUser',
        'service:i18n',
        'service:toast',
    ],
});

test('Initial properties', function (assert) {
    const ctrl = this.subject();

    const expected = {
        fullScreenMFR: false,
        savingAction: false,
        showLicense: false,
        _activeFile: null,
        chosenFile: null,
    };

    const propKeys = Object.keys(expected);
    const actual = ctrl.getProperties(propKeys);

    assert.ok(propKeys.every(key => expected[key] === actual[key]));
});

test('isAdmin computed property', function (assert) {
    this.inject.service('store');

    const ctrl = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const preprint = this.store.createRecord('preprint', { node });

        ctrl.setProperties({ preprint });
        ctrl.set('node.currentUserPermissions', ['admin']);

        assert.strictEqual(ctrl.get('isAdmin'), true);
    });
});


test('actionDateLabel computed property', function (assert) {
    this.inject.service('store');

    const ctrl = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const provider = this.store.createRecord('preprint-provider', {
            reviewsWorkflow: 'pre-moderation',
        });

        const preprint = this.store.createRecord('preprint', { node, provider });

        ctrl.setProperties({ preprint });

        assert.strictEqual(ctrl.get('actionDateLabel'), 'content.dateLabel.submittedOn');

        ctrl.set('preprint.provider.reviewsWorkflow', 'post-moderation');

        assert.strictEqual(ctrl.get('actionDateLabel'), 'content.dateLabel.createdOn');
    });
});

test('hasShortenedDescription computed property', function (assert) {
    this.inject.service('store');
    const ctrl = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const preprint = this.store.createRecord('preprint', { node });
        ctrl.setProperties({ preprint });
        ctrl.set('node.description', 'test description');

        assert.strictEqual(
            ctrl.get('hasShortenedDescription'),
            false,
        );

        ctrl.set('node.description', 'Lorem ipsum'.repeat(35));
        assert.strictEqual(
            ctrl.get('hasShortenedDescription'),
            true,
        );
    });
});

test('useShortenedDescription computed property', function (assert) {
    this.inject.service('store');
    const ctrl = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const preprint = this.store.createRecord('preprint', { node });
        ctrl.setProperties({ preprint });
        ctrl.set('node.description', 'test description');
        ctrl.set('expandedAbstract', false);

        assert.strictEqual(
            ctrl.get('useShortenedDescription'),
            false,
        );

        ctrl.set('expandedAbstract', false);
        ctrl.set('node.description', 'Lorem ipsum'.repeat(35));
        assert.strictEqual(
            ctrl.get('useShortenedDescription'),
            true,
        );
    });
});

test('description computed property', function (assert) {
    this.inject.service('store');

    const ctrl = this.subject();

    run(() => {
        const input = 'test description length'.repeat(20);
        const expected = 'test description length'.repeat(20).substring(0, 349);

        const node = this.store.createRecord('node', {
            description: input,
        });

        const preprint = this.store.createRecord('preprint', { node });
        ctrl.setProperties({ preprint });

        assert.strictEqual(
            ctrl.get('description'),
            expected,
        );
    });
});

test('toggleShowLicense action', function (assert) {
    const ctrl = this.subject();
    const initialValue = ctrl.get('showLicense');

    ctrl.send('toggleShowLicense');
    assert.strictEqual(ctrl.get('showLicense'), !initialValue);

    ctrl.send('toggleShowLicense');
    assert.strictEqual(ctrl.get('showLicense'), initialValue);
});

test('expandMFR action', function (assert) {
    const ctrl = this.subject();
    const initialValue = ctrl.get('fullScreenMFR');

    ctrl.send('expandMFR');
    assert.strictEqual(ctrl.get('fullScreenMFR'), !initialValue);

    ctrl.send('expandMFR');
    assert.strictEqual(ctrl.get('fullScreenMFR'), initialValue);
});

test('expandAbstract action', function (assert) {
    const ctrl = this.subject();
    const initialValue = ctrl.get('expandedAbstract');

    ctrl.send('expandAbstract');
    assert.strictEqual(ctrl.get('expandedAbstract'), !initialValue);

    ctrl.send('expandAbstract');
    assert.strictEqual(ctrl.get('expandedAbstract'), initialValue);
});

test('chooseFile action', function (assert) {
    this.inject.service('store');
    const ctrl = this.subject();

    run(() => {
        const fileItem = this.store.createRecord('file', {
            id: 'test1',
        });

        ctrl.send('chooseFile', fileItem);
        assert.strictEqual(ctrl.get('chosenFile'), 'test1');
    });
});

test('activeFile action', function (assert) {
    this.inject.service('store');
    const ctrl = this.subject();

    run(() => {
        const primaryFile = this.store.createRecord('file', {
            id: 'test1',
        });

        const anotherFile = this.store.createRecord('file', {
            id: 'test2',
        });

        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const preprint = this.store.createRecord('preprint', { node, primaryFile });

        ctrl.setProperties({ preprint });

        assert.strictEqual(ctrl.get('activeFile'), null);

        ctrl.send('chooseFile', anotherFile);

        assert.strictEqual(ctrl.get('activeFile'), anotherFile);

        ctrl.send('chooseFile', primaryFile);

        assert.strictEqual(ctrl.get('activeFile'), primaryFile);
    });
});

test('submitDecision action', function (assert) {
    this.inject.service('store');
    const ctrl = this.subject();

    run(() => {
        const initialValue = ctrl.get('savingAction');

        const action = {
            comment: '',
            save() { return (new Promise(function(resolve) { resolve('hello'); })); },
        };

        ctrl.set('store.createRecord', () => { return action; });

        const stub = this.stub(ctrl, '_saveAction');

        ctrl.send('submitDecision', 'accept', 'yes', 'accepted');
        assert.strictEqual(ctrl.get('savingAction'), !initialValue);
        assert.ok(stub.calledWithExactly(action, 'accepted'), 'correct arguments passed to _saveAction');

        ctrl.send('submitDecision', 'reject', 'no', 'rejected');
        assert.strictEqual(ctrl.get('savingAction'), initialValue);
        assert.ok(stub.calledWithExactly(action, 'rejected'), 'correct arguments passed to _saveAction');
    });
});

test('fileDownloadURL computed property', function (assert) {
    this.inject.service('store');
    this.inject.service('theme');

    const ctrl = this.subject();

    run(() => {
        const origin = 'http://localhost:4200';

        const window = { location: { origin } };

        ctrl.set('window', window);

        const node = this.store.createRecord('node', {
            description: 'test description',
        });

        const preprint = this.store.createRecord('preprint', { node });

        ctrl.setProperties({ preprint });
        ctrl.set('preprint.id', '6gtu');

        assert.strictEqual(ctrl.get('fileDownloadURL'), 'http://localhost:4201/6gtu/download');
    });
});
