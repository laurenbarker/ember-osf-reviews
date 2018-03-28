import EmberObject from '@ember/object';
import Service from '@ember/service';
import RSVP from 'rsvp';
import { test } from 'qunit';
import moduleForAcceptance from '../../../helpers/module-for-acceptance';


moduleForAcceptance('Acceptance | preprints/providers/moderators');

const sessionAuthenticatedStub = Service.extend({
    isAuthenticated() {
        return true;
    },
});

const sessionStub = Service.extend({
    authenticate() {
        return RSVP.reject('');
    },
    isAuthenticated: false,
});

const currentAdminUserStub = Service.extend({
    user: RSVP.resolve(EmberObject.create({ canViewReviews: true })),
});

const currentUserStub = Service.extend({
    user: RSVP.resolve(EmberObject.create({ canViewReviews: false })),
});

test('visiting /moderators not authenticated', function(assert) {
    this.application.register('service:session-service', sessionStub);
    this.application.inject('route:application', 'session', 'service:session-service');

    visit('/moderators');

    andThen(function() {
        assert.equal(currentURL(), '/');
    });
});

test('visiting /moderators authenticated', function(assert) {
    this.application.register('service:session-service', sessionAuthenticatedStub);
    this.application.inject('route:application', 'session', 'service:session-service');
    this.application.register('service:currentUser-service', currentUserStub);
    this.application.inject('route:application', 'currentUser', 'service:currentUser-service');
    visit('/moderators');

    andThen(function() {
        assert.equal(currentURL(), '/');
    });
});

test('visiting /moderators authenticated', function(assert) {
    this.application.register('service:session-service', sessionAuthenticatedStub);
    this.application.inject('route:application', 'session', 'service:session-service');
    this.application.register('service:currentUser-service', currentAdminUserStub);
    this.application.inject('route:application', 'currentUser', 'service:currentUser-service');
    visit('/moderators');

    andThen(function() {
        assert.equal(currentURL(), '/moderators');
    });
});
