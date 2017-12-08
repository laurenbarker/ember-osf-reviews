import EmberObject from '@ember/object';
import EmberService from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


// Stub store service
const storeStub = EmberService.extend({
    init() {
        this._super(...arguments);
        this.contributorList = {
            data: [
                EmberObject.create({ // Records to be returned by queryHasMany
                    users: { givenName: 'Brian', familyName: 'Nosek', profileURL: 'https://osf.io/12345' },
                    unregisteredContributor: null,
                    bibliographic: true,
                }), EmberObject.create({
                    unregisteredContributor: 'Unregistered Contributor',
                    bibliographic: true,
                }),
            ],
            links: { next: null },
            toArray() {
                return this.data;
            },
        };
    },
    queryHasMany () {
        return this.get('contributorList');
    },
});

moduleForComponent('contributor-list', 'Integration | Component | contributor-list', {
    integration: true,
    beforeEach() {
        this.register('service:store', storeStub);
        this.inject.service('store', { as: 'store' });
    },
});


test('it renders contributor-list', function(assert) {
    this.set('node', {});
    this.render(hbs`{{contributor-list contributors=null node=node}}`);
    assert.ok(this.$('ul').length);
    assert.equal(
        this.$('ul').text().replace(/\s+/g, ' ').trim(),
        'Brian Nosek ' +
        'Unregistered Contributor',
    );
});
