import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';


moduleForComponent('preprint-status-banner', 'Integration | Component | preprint-status-banner', {
    integration: true,
});

test('it renders preprint-status-banner', function(assert) {
    this.set('submitDecision', () => {});
    this.set('savingAction', false);
    this.set('submission', {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        reviewActions: new Promise(function(resolve) { resolve([]); }),
        reviewsState: 'accepted',
        provider: { reviewsWorkflow: 'pre-moderation' },
        node: { contributors: [{ users: { fullName: 'Mr. Ping' } }, { users: { fullName: 'Mantis' } }] },
    });
    this.render(hbs`{{preprint-status-banner submission=submission saving=savingAction submitDecision=submitDecision}}`);
    return wait()
        .then(() => {
            assert.ok(this.$('.flex-container').length);
            assert.equal(
                this.$('.recent-activity').text().replace(/\s+/g, ' ').trim(),
                'This was automatically accepted on October 27, 2017',
            );
            assert.equal(
                this.$('.reviewer-feedback').text().replace(/\s+/g, ' ').trim(),
                'Modify decision Modify your decision Comments are visible to contributors on decision Commenter\'s' +
                ' name is visible to contributors Submission appears in search results once accepted Accept Submission' +
                ' will appear in search results and be made public. Reject Submission will not appear in search results' +
                ' and will remain private. Modify decision Cancel',
            );
            assert.equal(this.$('.status-explanation').text().replace(/\s+/g, ' ').trim(), 'accepted');

            this.set('submission.reviewsState', 'pending');

            assert.equal(
                this.$('.reviewer-feedback').text().replace(/\s+/g, ' ').trim(),
                'Make decision Submit your decision Comments are visible to contributors on decision Commenter\'s name' +
                ' is visible to contributors Submission appears in search results once accepted Accept Submission will' +
                ' appear in search results and be made public. Reject Submission will not appear in search results and' +
                ' will remain private. Submit decision',
            );

            assert.equal(
                this.$('.recent-activity').text().replace(/\s+/g, ' ').trim(),
                'This was submitted on October 27, 2017',
            );

            assert.equal(this.$('.status-explanation').text().replace(/\s+/g, ' ').trim(), 'pending');

            this.set('submission.provider.reviewsWorkflow', 'post-moderation');

            assert.equal(
                this.$('.reviewer-feedback').text().replace(/\s+/g, ' ').trim(),
                'Make decision Submit your decision Comments are visible to contributors on decision Commenter\'s name' +
                ' is visible to contributors Submission will be removed from search results and made private if rejected' +
                ' Accept Submission will continue to appear in search results. Reject Submission will be removed from' +
                ' search results and made private. Submit decision',
            );
        });
});
