import { moduleForComponent, test } from 'ember-qunit';


moduleForComponent('moderator-list-add', 'Unit | Component | moderator list add', {
    unit: true,
    needs: [
        'service:i18n',
        'service:theme',
        'validator:presence',
        'validator:length',
        'validator:format',
    ],
});

test('roleLabel computed property', function(assert) {
    const component = this.subject({
        roleOptions: [
            {
                role: 'admin',
                label: 'Admin',
            },
            {
                role: 'moderator',
                label: 'Moderator',
            },
        ],
    });
    assert.ok(component);

    component.set('role', 'admin');
    assert.strictEqual(component.get('roleLabel'), 'Admin');

    component.set('role', 'moderator');
    assert.strictEqual(component.get('roleLabel'), 'Moderator');
});

test('selectedUserId computed property', function(assert) {
    const component = this.subject({
        selectedUser: { id: 12345 },
        unregisteredUserEmail: '',
    });
    assert.ok(component);

    assert.strictEqual(component.get('selectedUserId'), 12345);

    component.set('selectedUser', '');
    component.set('unregisteredUserEmail', 'testuser@gmail.com');
    assert.strictEqual(component.get('selectedUserId'), 'testuser@gmail.com');
});

test('disableSave computed property', function(assert) {
    const component = this.subject({
        role: '',
        selectedUser: '',
        unregisteredUserName: '',
    });
    assert.ok(component);
    assert.strictEqual(component.get('disableSave'), true);

    component.set('selectedUser', { id: 12345 });
    assert.strictEqual(component.get('disableSave'), true);

    component.set('role', 'admin');
    assert.strictEqual(component.get('disableSave'), false);

    component.set('unregisteredUserName', 'Test User');
    component.set('selectedUser', '');
    assert.strictEqual(component.get('disableSave'), false);
});

test('showInviteForm computed property', function(assert) {
    const component = this.subject({
        selectedUser: '',
        selectedUnregisteredUser: false,
    });
    assert.ok(component);
    assert.strictEqual(component.get('showInviteForm'), true);

    component.set('selectedUser', { id: 12345 });
    assert.strictEqual(component.get('showInviteForm'), false);

    component.set('selectedUnregisteredUser', true);
    component.set('selectedUser', '');
    assert.strictEqual(component.get('showInviteForm'), false);
});

test('roleChanged action', function (assert) {
    const component = this.subject();

    component.set('role', 'admin');

    component.send('roleChanged', 'moderator');
    assert.strictEqual(component.get('role'), 'moderator');
});

test('cancel action', function (assert) {
    const component = this.subject();

    component.set('role', 'moderator');
    component.set('selectedUser', { id: 12345 });
    component.set('editingModerator', true);
    component.set('addingNewModerator', true);

    component.send('cancel');

    assert.strictEqual(component.get('role'), '');
    assert.strictEqual(component.get('selectedUser'), '');
    assert.strictEqual(component.get('editingModerator'), false);
    assert.strictEqual(component.get('addingNewModerator'), false);
});
