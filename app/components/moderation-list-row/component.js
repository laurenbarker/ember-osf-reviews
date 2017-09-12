import Ember from 'ember';

export default Ember.Component.extend({
    theme: Ember.inject.service(),

    classNames: ['moderation-list-row'],

    iconClass: {
        accepted: 'fa-check-circle-o accepted',
        pending: 'fa-hourglass-o pending',
        rejected: 'fa-times-circle-o rejected'
    },

    //translations
    submittedOnLabel: 'components.moderation-list-row.submission.submitted_on',
    submittedByLabel: 'components.moderation-list-row.submission.by',
});
