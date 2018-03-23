import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';


const storeStub = Service.extend({
    findRecord() {
        const user = {
            links: {
                profile_image: 'https://gravator.com/1234/',
                html: 'https://localhost:5000/12345/',
            },
        };
        return user;
    },
});

moduleForComponent('moderator-list-row', 'Integration | Component | moderator-list-row', {
    integration: true,

    beforeEach() {
        this.register('service:store', storeStub);
        this.inject.service('store');
    },
});

test('it renders moderator-list-row admin view', function(assert) {
    this.set('roleOptions', [
        {
            role: 'admin',
            label: 'Admin',
        },
        {
            role: 'moderator',
            label: 'Moderator',
        },
    ]);
    this.set('updateModerator', function() { return true; });
    this.set('deleteModerator', function() { return true; });
    this.set('moderator', {
        permissionGroup: 'admin',
        fullName: 'Brian Nosek',
        id: '12345',
    });
    this.render(hbs`{{moderator-list-row
                moderator=moderator
                isAdmin=true
                disableAdminDeletion=false
                editingModerator=false
                updateModerator=updateModerator
                deleteModerator=deleteModerator
                roleOptions=roleOptions
            }}`);
    assert.ok(this.$('.moderator-name').length);
    assert.ok(this.$('.dropdown-button').length);
    assert.ok(this.$('.row-controls').length);
    assert.notOk(this.$('.remove-button.disabled').length);

    assert.equal(this.$('.moderator-name > .name').text().replace(/\s+/g, ' ').trim(), 'Brian Nosek');
    assert.equal(this.$('.dropdown-button').text().replace(/\s+/g, ' ').trim(), 'Admin');
});

test('it renders moderator-list-row admin view remove disabled for admin', function(assert) {
    this.set('roleOptions', [
        {
            role: 'admin',
            label: 'Admin',
        },
        {
            role: 'moderator',
            label: 'Moderator',
        },
    ]);
    this.set('updateModerator', function() { return true; });
    this.set('deleteModerator', function() { return true; });
    this.set('moderator', {
        permissionGroup: 'admin',
        fullName: 'Brian Nosek',
        id: '12345',
    });
    this.render(hbs`{{moderator-list-row
                moderator=moderator
                isAdmin=true
                disableAdminDeletion=true
                editingModerator=false
                updateModerator=updateModerator
                deleteModerator=deleteModerator
                roleOptions=roleOptions
            }}`);
    assert.ok(this.$('.moderator-name').length);
    assert.ok(this.$('.dropdown-button').length);
    assert.ok(this.$('.row-controls').length);
    assert.ok(this.$('.remove-button.disabled').length);

    assert.equal(this.$('.moderator-name > .name').text().replace(/\s+/g, ' ').trim(), 'Brian Nosek');
    assert.equal(this.$('.dropdown-button').text().replace(/\s+/g, ' ').trim(), 'Admin');
});

test('it renders moderator-list-row admin view remove not disabled for mod', function(assert) {
    this.set('roleOptions', [
        {
            role: 'admin',
            label: 'Admin',
        },
        {
            role: 'moderator',
            label: 'Moderator',
        },
    ]);
    this.set('updateModerator', function() { return true; });
    this.set('deleteModerator', function() { return true; });
    this.set('moderator', {
        permissionGroup: 'moderator',
        fullName: 'Brian Nosek',
        id: '12345',
    });
    this.render(hbs`{{moderator-list-row
                moderator=moderator
                isAdmin=true
                disableAdminDeletion=true
                editingModerator=false
                updateModerator=updateModerator
                deleteModerator=deleteModerator
                roleOptions=roleOptions
            }}`);
    assert.ok(this.$('.moderator-name').length);
    assert.ok(this.$('.dropdown-button').length);
    assert.ok(this.$('.row-controls').length);
    assert.notOk(this.$('.remove-button.disabled').length);

    assert.equal(this.$('.moderator-name > .name').text().replace(/\s+/g, ' ').trim(), 'Brian Nosek');
    assert.equal(this.$('.dropdown-button').text().replace(/\s+/g, ' ').trim(), 'Moderator');
});

test('it renders moderator-list-row admin view remove disabled for mod', function(assert) {
    this.set('roleOptions', [
        {
            role: 'admin',
            label: 'Admin',
        },
        {
            role: 'moderator',
            label: 'Moderator',
        },
    ]);
    this.set('updateModerator', function() { return true; });
    this.set('deleteModerator', function() { return true; });
    this.set('moderator', {
        permissionGroup: 'moderator',
        fullName: 'Brian Nosek',
        id: '12345',
    });
    this.render(hbs`{{moderator-list-row
                moderator=moderator
                isAdmin=true
                disableAdminDeletion=false
                editingModerator=true
                updateModerator=updateModerator
                deleteModerator=deleteModerator
                roleOptions=roleOptions
            }}`);
    assert.ok(this.$('.moderator-name').length);
    assert.ok(this.$('.dropdown-button').length);
    assert.ok(this.$('.row-controls').length);
    assert.ok(this.$('.remove-button.disabled').length);

    assert.equal(this.$('.moderator-name > .name').text().replace(/\s+/g, ' ').trim(), 'Brian Nosek');
    assert.equal(this.$('.dropdown-button').text().replace(/\s+/g, ' ').trim(), 'Moderator');
});

test('it renders moderator-list-row moderator view', function(assert) {
    this.set('roleOptions', [
        {
            role: 'admin',
            label: 'Admin',
        },
        {
            role: 'moderator',
            label: 'Moderator',
        },
    ]);
    this.set('updateModerator', function() { return true; });
    this.set('deleteModerator', function() { return true; });
    this.set('moderator', EmberObject.create({
        permissionGroup: 'moderator',
        fullName: 'Brian Nosek',
        id: '12345',
    }));
    this.render(hbs`{{moderator-list-row
                moderator=moderator
                isAdmin=false
                disableAdminDeletion=false
                editingModerator=false
                updateModerator=updateModerator
                deleteModerator=deleteModerator
                roleOptions=roleOptions
            }}`);
    assert.ok(this.$('.moderator-name').length);
    assert.notOk(this.$('.dropdown-button').length);
    assert.notOk(this.$('.row-controls').length);
});
