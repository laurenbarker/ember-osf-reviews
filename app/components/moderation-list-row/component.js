import Ember from 'ember';
import moment from 'moment';

const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';

const ACTION_LABELS = Object.freeze({
    [PENDING]: {
        gtDay: 'components.moderation-list-row.submission.submitted_on',
        ltDay: 'components.moderation-list-row.submission.submitted',
    },
    [ACCEPTED]: {
        gtDay: 'components.moderation-list-row.submission.was_accepted_on',
        ltDay: 'components.moderation-list-row.submission.was_accepted',
    },
    [REJECTED]: {
        gtDay: 'components.moderation-list-row.submission.was_rejected_on',
        ltDay: 'components.moderation-list-row.submission.was_rejected',
    }
});


export default Ember.Component.extend({
    theme: Ember.inject.service(),

    classNames: ['moderation-list-row'],

    iconClass: {
        accepted: 'fa-check-circle-o accepted',
        pending: 'fa-hourglass-o pending',
        rejected: 'fa-times-circle-o rejected'
    },

    firstContributors: Ember.computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors').slice(0, 3);
    }),

    additionalContributors: Ember.computed('submission.node.contributors', function() {
        return this.get('submission.node.contributors.content.meta.pagination.total') - 3;
    }),

    gtDay: Ember.computed('submission.dateLastTransitioned', function() {
        return moment().diff(this.get('submission.dateLastTransitioned'), 'days') > 1;
    }),

    relevantDate: Ember.computed('submission.dateLastTransitioned', 'gtDay', function() {
        return this.get('gtDay') ?
            moment(this.get('submission.dateLastTransitioned')).format('MMMM DD, YYYY') :
            moment(this.get('submission.dateLastTransitioned')).fromNow();
    }),

    //translations
    dateLabel: Ember.computed('submission.reviewsState', 'gtDay', function() {
        const dayValue = this.get('gtDay') ? 'gtDay' : 'ltDay';
        return ACTION_LABELS[this.get('submission.reviewsState')][dayValue];
    }),

    submittedByLabel: Ember.computed('submission.reviewsState', function() {
        return this.get('submission.reviewsState') === PENDING ?
            'components.moderation-list-row.submission.by' :
            'components.moderation-list-row.submission.submission_by';
    }),
});
