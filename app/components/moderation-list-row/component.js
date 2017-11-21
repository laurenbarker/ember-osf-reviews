import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import moment from 'moment';
import { task } from 'ember-concurrency';

import latestAction from 'reviews/utils/latest-action';

const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';

const ACTION_LABELS = Object.freeze({
    [PENDING]: {
        gtDay: 'components.moderationListRow.submission.submittedOn',
        ltDay: 'components.moderationListRow.submission.submitted',
    },
    [ACCEPTED]: {
        gtDay: 'components.moderationListRow.submission.acceptedOn',
        ltDay: 'components.moderationListRow.submission.accepted',
        gtDay_automatic: 'components.moderationListRow.submission.acceptedAutomaticallyOn',
        ltDay_automatic: 'components.moderationListRow.submission.acceptedAutomatically',
    },
    [REJECTED]: {
        gtDay: 'components.moderationListRow.submission.rejectedOn',
        ltDay: 'components.moderationListRow.submission.rejected',
    },
});


export default Component.extend({
    theme: service(),
    i18n: service(),

    classNames: ['moderation-list-row'],

    latestActionCreator: computed.alias('latestAction.creator.fullName'),

    latestAction: computed('submission.actions.[]', function() {
        return latestAction(this.get('submission.actions'));
    }),

    noActions: computed('submission.actions.length', function () {
        return !this.get('submission.actions.length');
    }),

    firstContributors: computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors').slice(0, 3);
    }),

    additionalContributors: computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors.content.meta.pagination.total') - 3;
    }),

    gtDay: computed('submission.dateLastTransitioned', function() {
        return moment().diff(this.get('submission.dateLastTransitioned'), 'days') > 1;
    }),

    relevantDate: computed('submission.dateLastTransitioned', 'gtDay', function() {
        return this.get('gtDay') ?
            moment(this.get('submission.dateLastTransitioned')).format('MMMM DD, YYYY') :
            moment(Math.min(Date.parse(this.get('submission.dateLastTransitioned')), Date.now())).fromNow();
    }),

    // translations
    statusTimeDate: computed('submission.reviewsState', 'gtDay', 'noActions', function() {
        const i18n = this.get('i18n');
        const dayValue = this.get('gtDay') ? 'gtDay' : 'ltDay';
        const timeWording = this.get('noActions') ? `${dayValue}_automatic` : dayValue;
        const labels = ACTION_LABELS[this.get('submission.reviewsState')][timeWording];
        return i18n.t(labels, { timeDate: this.get('relevantDate'), moderatorName: this.get('latestActionCreator') });
    }),

    didReceiveAttrs() {
        this.iconClass = {
            accepted: 'fa-check-circle-o accepted',
            pending: 'fa-hourglass-o pending',
            rejected: 'fa-times-circle-o rejected',
        };
        this.get('fetchData').perform();
    },

    fetchData: task(function* () {
        const node = yield this.get('submission.node');
        yield node.get('contributors');
        yield this.get('submission.actions');
    }),
});
