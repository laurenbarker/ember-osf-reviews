import EmberObject from '@ember/object';
import Service from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


const themeStub = Service.extend({
    id: 'OSF',
    name: 'Open Science Framework',
    reviewableStatusCounts: EmberObject.create({
        pending: 12,
        accepted: 5,
        rejected: 3,
        initial: 0,
    }),
});

moduleForComponent('moderation-list', 'Integration | Component | moderation-list', {
    integration: true,
    beforeEach() {
        this.register('service:theme-service', themeStub);
        // Calling inject puts the service instance in the context of the test,
        // making it accessible as "theme" within each test
        this.inject.service('theme-service', { as: 'theme' });
    },
});

test('moderation-list no submissions', function(assert) {
    this.set('statusChanged', () => {});
    this.set('pageChanged', () => {});
    this.set('sortChanged', () => {});
    this.set('submissions', []);
    this.render(hbs`
        {{moderation-list
            statusChanged=statusChanged
            pageChanged=pageChanged
            sortChanged=sortChanged
            submissions=submissions
            page=1
            sort='-date_last_transitioned'
            status='pending'
            loading=false
            totalPages=2
        }}`);

    assert.equal(this.$('.moderation-list-row').text().trim(), 'No submissions.');
});

test('moderation-list full page submissions', function(assert) {
    this.set('statusChanged', () => {});
    this.set('pageChanged', () => {});
    this.set('sortChanged', () => {});
    this.set('submissions', []);

    const submission = {
        dateLastTransitioned: '2017-10-27T19:14:27.816946Z',
        reviewActions: [
            EmberObject.create({
                fromState: 'initial',
                toState: 'pending',
                dateModified: '2017-10-27T14:57:35.949534Z',
                creator: { fullName: 'Viper' },
            }),
        ],
        reviewsState: 'accepted',
        node: EmberObject.create({ contributors: ['Viper', 'Oogway'] }),
    };

    for (let step = 0; step < 10; step++) {
        this.get('submissions').push(submission);
    }

    this.render(hbs`
        {{moderation-list
            statusChanged=statusChanged
            pageChanged=pageChanged
            sortChanged=sortChanged
            submissions=submissions
            page=1
            sort='-date_last_transitioned'
            status='pending'
            loading=false
            totalPages=2
        }}`);

    assert.equal(this.$('.moderation-list-row').length, 10);
});
