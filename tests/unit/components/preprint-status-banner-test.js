import { run } from '@ember/runloop';
import { moduleForComponent } from 'ember-qunit';
import EmberService from '@ember/service';
import test from 'ember-sinon-qunit/test-support/test';
import tHelper from 'ember-i18n/helper';


moduleForComponent('preprint-status-banner', 'Unit | Component | preprint status banner', {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true,
    needs: [
        'model:review-action',
        'model:node',
        'model:user',
        'model:preprint',
        'model:preprint-provider',
        'service:i18n',
        'service:theme',
    ],
});

test('commentExceedsLimit computed property', function(assert) {
    const component = this.subject();
    assert.ok(component);

    component.set('reviewerComment', 'hi test welcome'.repeat(4500));
    assert.ok(component.get('commentExceedsLimit'));
});

test('getClassName computed property', function(assert) {
    this.inject.service('store');
    const component = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const provider = this.store.createRecord('preprint-provider', {
            reviewsWorkflow: 'pre-moderation',
        });

        const submission = this.store.createRecord('preprint', { node, provider });
        component.setProperties({ submission });
        component.set('reviewsWorkflow', 'pre-moderation');

        component.set('submission.reviewsState', 'pending');
        assert.strictEqual(component.get('getClassName'), 'preprint-status-pending-pre');

        component.set('submission.reviewsState', 'accepted');
        assert.strictEqual(component.get('getClassName'), 'preprint-status-accepted');
    });
});

test('statusExplanation computed property', function(assert) {
    this.inject.service('store');
    const component = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const provider = this.store.createRecord('preprint-provider', {
            reviewsWorkflow: 'pre-moderation',
        });

        const submission = this.store.createRecord('preprint', { node, provider });
        component.setProperties({ submission });
        component.set('reviewsWorkflow', 'pre-moderation');

        component.set('submission.reviewsState', 'pending');
        assert.strictEqual(component.get('statusExplanation'), 'components.preprintStatusBanner.message.pendingPre');

        component.set('submission.reviewsState', 'accepted');
        assert.strictEqual(component.get('statusExplanation'), 'components.preprintStatusBanner.message.accepted');
    });
});

test('recentActivityLanguage computed property', function(assert) {
    this.inject.service('store');
    const component = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const provider = this.store.createRecord('preprint-provider', {
            reviewsWorkflow: 'pre-moderation',
        });

        const submission = this.store.createRecord('preprint', { node, provider });
        component.setProperties({ submission });
        component.set('reviewsWorkflow', 'pre-moderation');

        component.set('noActions', false);
        component.set('submission.reviewsState', 'pending');
        assert.strictEqual(component.get('recentActivityLanguage'), 'components.preprintStatusBanner.recentActivity.pending');

        component.set('submission.reviewsState', 'accepted');
        assert.strictEqual(component.get('recentActivityLanguage'), 'components.preprintStatusBanner.recentActivity.accepted');

        component.set('noActions', true);
        component.set('submission.reviewsState', 'pending');
        assert.strictEqual(component.get('recentActivityLanguage'), 'components.preprintStatusBanner.recentActivity.automatic.pending');

        component.set('submission.reviewsState', 'accepted');
        assert.strictEqual(component.get('recentActivityLanguage'), 'components.preprintStatusBanner.recentActivity.automatic.accepted');
    });
});

test('latestAction computed property', function(assert) {
    this.inject.service('store');
    const component = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const provider = this.store.createRecord('preprint-provider', {
            reviewsWorkflow: 'pre-moderation',
        });

        const reviewActions = [
            this.store.createRecord('review-action', {
                fromState: 'rejected', toState: 'accepted', dateModified: '2017-10-29T14:57:35.949534Z', creator: { fullName: 'Kung-fu Panda' },
            }),
            this.store.createRecord('review-action', {
                fromState: 'pending', toState: 'rejected', dateModified: '2017-10-27T14:57:35.949534Z', creator: { fullName: 'Po' },
            }),
            this.store.createRecord('review-action', {
                fromState: 'initial', toState: 'pending', dateModified: '2017-10-25T14:57:35.949534Z', creator: { fullName: 'Viper' },
            }),
        ];

        const submission = this.store.createRecord('preprint', { node, provider, reviewActions });
        component.setProperties({ submission });

        assert.strictEqual(component.get('latestAction.dateModified'), '2017-10-29T14:57:35.949534Z');
        assert.strictEqual(component.get('latestAction.toState'), 'accepted');
    });
});

test('labelDecisionBtn computed property', function(assert) {
    this.inject.service('store');
    const component = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const submission = this.store.createRecord('preprint', { node });
        component.setProperties({ submission });

        component.set('decision', 'accepted');
        component.set('submission.reviewsState', 'rejected');
        component.set('reviewerComment', 'test comment');
        component.set('initialReviewerComment', 'test comment2');


        assert.strictEqual(component.get('labelDecisionBtn'), 'components.preprintStatusBanner.decision.btn.modifyDecision');

        component.set('decision', 'accepted');
        component.set('submission.reviewsState', 'accepted');

        assert.strictEqual(component.get('labelDecisionBtn'), 'components.preprintStatusBanner.decision.btn.update_comment');
    });
});

test('submit action', function(assert) {
    this.inject.service('store');
    const component = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const submission = this.store.createRecord('preprint', { node });
        component.setProperties({ submission });

        component.set('submission.reviewsState', 'rejected');
        component.set('reviewerComment', 'comment');
        component.set('decisionChanged', false);
        component.set('decision', 'accepted');
        component.set('commentEdited', true);
        component.set('submitDecision', () => {});
        const stub = this.stub(component, 'submitDecision');

        component.send('submit');
        assert.ok(stub.calledOnce);

        assert.ok(stub.calledWithExactly('edit_comment', 'comment', 'accepted'));

        component.set('commentEdited', false);
        component.send('submit');
        assert.ok(stub.calledWithExactly('accept', 'comment', 'accepted'));
    });
});

test('cancel action', function(assert) {
    this.inject.service('store');
    const component = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const submission = this.store.createRecord('preprint', { node });
        component.setProperties({ submission });

        component.set('submission.reviewsState', 'rejected');
        component.set('initialReviewerComment', 'comment');

        component.send('cancel');

        assert.strictEqual(component.get('decision'), component.get('submission.reviewsState'));
        assert.strictEqual(component.get('reviewerComment'), component.get('initialReviewerComment'));
    });
});

test('_handleActions  action', function(assert) {
    this.inject.service('store');
    const component = this.subject();

    run(() => {
        const node = this.store.createRecord('node', {
            title: 'test title',
            description: 'test description',
        });

        const action = this.store.createRecord('review-action', {
            fromState: 'rejected',
            toState: 'accepted',
            dateModified: '2017-10-29T14:57:35.949534Z',
            creator: { fullName: 'Kung-fu Panda' },
            comment: 'test comment',
        });

        const submission = this.store.createRecord('preprint', { node });

        component.setProperties({ submission });

        component.set('submission.reviewsState', 'accepted');

        component._handleActions(action);

        assert.strictEqual(component.get('initialReviewerComment'), 'test comment');
        assert.strictEqual(component.get('reviewerComment'), 'test comment');
        assert.strictEqual(component.get('decision'), 'accepted');

        component.set('submission.reviewsState', 'pending');

        component._handleActions(action);

        assert.strictEqual(component.get('initialReviewerComment'), '');
        assert.strictEqual(component.get('reviewerComment'), '');
        assert.strictEqual(component.get('decision'), 'accepted');

        assert.strictEqual(component.get('noActions'), false);

        component._handleActions();
        assert.strictEqual(component.get('noActions'), true);

        assert.strictEqual(component.get('loadingActions'), false);
    });
});

// Stub i18n service
const i18nStub = EmberService.extend({
    t(key, arg) {
        const translated = {
            'components.preprintStatusBanner.decision.commentLengthError':
                `Comment is ${arg.difference} character(s) too long (maximum is ${arg.limit}).`,
        };
        return translated[key];
    },
});

test('commentLengthErrorMessage computed property', function(assert) {
    this.inject.service('store');
    this.registry.register('helper:t', tHelper);
    this.register('service:i18n', i18nStub);
    const component = this.subject();

    component.set('reviewerComment', 'test comment for error message'.repeat(2000));
    assert.strictEqual(component.get('commentLengthErrorMessage'), 'Comment is 5535 character(s) too long (maximum is 65535).');
});
