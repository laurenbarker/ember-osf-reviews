import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('moderation-list-row', 'Integration | Component | moderation-list-row', {
    integration: true,
});


test('it renders moderation-list-row accepted with actions', function(assert) {
    this.set('submission', {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        actions: [
            EmberObject.create({
                fromState: 'pending',
                toState: 'accepted',
                dateModified: '2017-10-28T14:57:35.949534Z',
                creator: { fullName: 'Kung-fu Panda' },
            }),
            EmberObject.create({
                fromState: 'initial',
                toState: 'pending',
                dateModified: '2017-10-27T14:57:35.949534Z',
                creator: { fullName: 'Viper' },
            }),
        ],
        reviewsState: 'accepted',
        node: EmberObject.create({ contributors: ['Viper', 'Oogway'] }),
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.ok(this.$('[data-status=accepted]').length);
    assert.notOk(this.$('[data-status=pending]').length);
    assert.notOk(this.$('[data-status=rejected]').length);

    assert.equal(this.$('[data-status=accepted]').text().trim(), 'accepted on October 27, 2017 by Kung-fu Panda');
});

test('it renders moderation-list-row accepted without actions', function(assert) {
    this.set('submission', {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        actions: [],
        reviewsState: 'accepted',
        node: EmberObject.create({ contributors: ['Tigerss', 'Crane'] }),
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.equal(this.$('[data-status=accepted]').text().trim(), 'accepted automatically on October 27, 2017');
});

test('it renders moderation-list-row rejected with actions', function(assert) {
    this.set('submission', {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        actions: [
            EmberObject.create({
                fromState: 'pending',
                toState: 'rejected',
                dateModified: '2017-10-28T14:57:35.949534Z',
                creator: { fullName: 'Master Shifu' },
            }),
            EmberObject.create({
                fromState: 'initial',
                toState: 'pending',
                dateModified: '2017-10-27T14:57:35.949534Z',
                creator: { fullName: 'Mantis' },
            }),
        ],
        reviewsState: 'rejected',
        node: EmberObject.create({ contributors: ['Mr. Ping', 'Mantis'] }),
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.equal(this.$('[data-status=rejected]').text().trim(), 'rejected on October 27, 2017 by Master Shifu');
});

test('it renders moderation-list-row pending with actions', function(assert) {
    this.set('submission', {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        actions: [
            EmberObject.create({
                fromState: 'initial',
                toState: 'pending',
                dateModified: '2017-10-27T14:57:35.949534Z',
                creator: { fullName: 'Mantis' },
            }),
        ],
        reviewsState: 'pending',
        node: EmberObject.create({
            contributors: [{ users: { fullName: 'Mr. Ping' } }, { users: { fullName: 'Mantis' } }],
        }),
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.equal(this.$('[data-status=pending]').text().replace(/\n/g, ' ').trim(), 'submitted on October 27, 2017 by Mr. Ping Mantis');
});

test('it renders moderation-list-row pending with actions and more than three contributors', function(assert) {
    this.set('submission', {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        actions: [
            EmberObject.create({
                fromState: 'initial',
                toState: 'pending',
                dateModified: '2017-10-27T14:57:35.949534Z',
                creator: { fullName: 'Mantis' },
            }),
        ],
        reviewsState: 'pending',
        node: EmberObject.create({
            contributors: [
                { users: { fullName: 'Mr. Ping' } },
                { users: { fullName: 'Mantis' } },
                { users: { fullName: 'Crane' } },
                { users: { fullName: 'Tai Lung' } },
            ],
        }),
    });
    this.set('submission.node.contributors.content', {
        meta: {
            pagination: {
                total: this.get('submission.node.contributors.length'),
            },
        },
    });
    this.render(hbs`{{moderation-list-row submission=submission}}`);
    assert.equal(this.$('[data-status=pending]').text().replace(/\s+/g, ' ').trim(), 'submitted on October 27, 2017 by Mr. Ping Mantis Crane + 1');
});
