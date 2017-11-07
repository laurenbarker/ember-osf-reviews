import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('action-feed-entry', 'Integration | Component | action-feed-entry', {
    integration: true,
});


test('it renders action-feed-entry', function(assert) {
    this.set('action', EmberObject.create({
        dateCreated: '2017-10-28T14:57:35.949534Z',
        creator: { fullName: 'Po' },
        provider: { name: 'viperXiv', preprintWord: 'preprint' },
        actionTrigger: 'submit',
        target: { title: 'Using machine learning for better bambo taste' },
    }));
    this.set('toDetail', () => {});
    this.render(hbs`{{action-feed-entry action=action toDetail=toDetail}}`);
    assert.ok(this.$('.action-body').length);
    assert.equal(
        this.$('.action-body').text().replace(/\s+/g, ' ').trim(),
        'October 28, 2017 Po submitted a preprint to viperXiv Using machine learning for better bambo taste',
    );
});
