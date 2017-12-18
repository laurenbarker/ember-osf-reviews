import EmberObject from '@ember/object';
import EmberService from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


// Stub store service
const storeStub = EmberService.extend({
    init() {
        this._super(...arguments);
        this.actionList = [EmberObject.create({ // Records to be returned by query
            dateCreated: '2017-10-28T14:57:35.949534Z',
            creator: { fullName: 'Po' },
            provider: { name: 'viperXiv', preprintWord: 'preprint' },
            actionTrigger: 'submit',
            target: { title: 'the archive of all vipers' },
        }), EmberObject.create({
            dateCreated: '2017-10-27T14:57:35.949534Z',
            creator: { fullName: 'Tigerss' },
            provider: { name: 'viperXiv', preprintWord: 'preprint' },
            actionTrigger: 'submit',
            target: { title: 'the archive of all vipers' },
        })];
    },
    query() {
        return this.get('noActions') ? [] : this.get('actionList');
    },
});

moduleForComponent('action-feed', 'Integration | Component | action-feed', {
    integration: true,
    beforeEach() {
        this.register('service:store', storeStub);
        this.inject.service('store', { as: 'store' });
    },
});


test('it renders action-feed non-empty list', function(assert) {
    this.set('store.noActions', false); // Store queryHasMany return records
    this.set('toDetail', () => {});
    this.render(hbs`{{action-feed toDetail=toDetail}}`);
    assert.ok(this.$('.action-feed').length);
    assert.equal(
        this.$('.action-feed').text().replace(/\s+/g, ' ').trim(),
        'October 28, 2017 Po submitted a preprint to viperXiv the archive of all vipers October 27, 2017 ' +
        'Tigerss submitted a preprint to viperXiv the archive of all vipers',
    );
});

test('it renders action-feed empty list', function(assert) {
    this.set('store.noActions', true); // Store queryHasMany return no records
    this.set('toDetail', () => {});
    this.render(hbs`{{action-feed toDetail=toDetail}}`);
    assert.ok(this.$('.action-feed').length);
    assert.equal(this.$('.action-feed').text().replace(/\s+/g, ' ').trim(), 'No recent activity.');
});
