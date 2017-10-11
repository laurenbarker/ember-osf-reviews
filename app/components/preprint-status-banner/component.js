import Ember from 'ember';
import moment from 'moment';

const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';

const PRE_MODERATION = 'pre-moderation';
const POST_MODERATION = 'post-moderation';

const ICONS = {
    [PENDING]: 'fa-hourglass-o',
    [ACCEPTED]: 'fa-check-circle-o',
    [REJECTED]: 'fa-times-circle-o'
};

const STATUS = {
    [PENDING]: 'components.preprint-status-banner.pending',
    [ACCEPTED]: 'components.preprint-status-banner.accepted',
    [REJECTED]: 'components.preprint-status-banner.rejected'
};

const MESSAGE = {
    [PRE_MODERATION]: 'components.preprint-status-banner.message.pending_pre',
    [POST_MODERATION]: 'components.preprint-status-banner.message.pending_post',
    [ACCEPTED]: 'components.preprint-status-banner.message.accepted',
    [REJECTED]: 'components.preprint-status-banner.message.rejected'
};

const CLASS_NAMES = {
    [PRE_MODERATION]: 'preprint-status-pending-pre',
    [POST_MODERATION]: 'preprint-status-pending-post',
    [ACCEPTED]: 'preprint-status-accepted',
    [REJECTED]: 'preprint-status-rejected'
};

const SETTINGS = {
    'comments': {
        'public': 'components.preprint-status-banner.settings.comments.public',
        'private': 'components.preprint-status-banner.settings.comments.private'
    },
    'names': {
        'anonymous': 'components.preprint-status-banner.settings.names.anonymous',
        'named': 'components.preprint-status-banner.settings.names.named'
    },
    'moderation': {
        [PRE_MODERATION]: 'components.preprint-status-banner.settings.moderation.pre',
        [POST_MODERATION]: 'components.preprint-status-banner.settings.moderation.post'
    }
}

const SETTINGS_ICONS = {
    'comments': {
        'public': 'fa-eye',
        'private': 'fa-eye-slash'
    },
    'names': {
        'anonymous': 'fa-user-secret',
        'named': 'fa-user'
    },
    'moderation': {
        [PRE_MODERATION]: 'fa-key',
        [POST_MODERATION]: 'fa-globe'
    }
};

const DECISION_EXPLANATION = {
    'accept': {
        [PRE_MODERATION]: 'components.preprint-status-banner.decision.accept.pre',
        [POST_MODERATION]: 'components.preprint-status-banner.decision.accept.post'
    },
    'reject': {
        [PRE_MODERATION]: 'components.preprint-status-banner.decision.reject.pre',
        [POST_MODERATION]: 'components.preprint-status-banner.decision.reject.post'
    }
};

const RECENT_ACTIVITY = {
    [PENDING]: 'components.preprint-status-banner.recent_activity.pending',
    [ACCEPTED]: 'components.preprint-status-banner.recent_activity.accepted',
    [REJECTED]: 'components.preprint-status-banner.recent_activity.rejected',
    automatic: {
        [PENDING]: 'components.preprint-status-banner.recent_activity.automatic.pending',
        [ACCEPTED]: 'components.preprint-status-banner.recent_activity.automatic.accepted',
    },
};

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    theme: Ember.inject.service(),

    // translations
    moderator: 'components.preprint-status-banner.decision.moderator',
    feedbackBaseMessage: 'components.preprint-status-banner.decision.base',
    commentPlaceholder:'components.preprint-status-banner.decision.comment_placeholder',
    labelAccept: 'components.preprint-status-banner.decision.accept.label',
    labelReject: 'components.preprint-status-banner.decision.reject.label',

    classNames: ['preprint-status-component'],

    loadingActions: true,
    noActions: false,

    reviewsWorkflow: Ember.computed.alias('submission.provider.reviewsWorkflow'),
    reviewsCommentsPrivate: Ember.computed.alias('submission.provider.reviewsCommentsPrivate'),
    reviewsCommentsAnonymous: Ember.computed.alias('submission.provider.reviewsCommentsAnonymous'),

    getClassName: Ember.computed('reviewsWorkflow', 'submission.reviewsState', function() {
        return this.get('submission.reviewsState') === PENDING ?
            CLASS_NAMES[this.get('reviewsWorkflow')] :
            CLASS_NAMES[this.get('submission.reviewsState')];
    }),

    latestAction: Ember.computed('submission.actions.[]', function() {
        if (!this.get('submission.actions.length')) {
            return null;
        }
        // on create, Ember puts the new object at the end of the array
        // https://stackoverflow.com/questions/15210249/ember-data-insert-new-item-at-beginning-of-array-instead-of-at-the-end
        const first = this.get('submission.actions.firstObject');
        const last = this.get('submission.actions.lastObject');
        return moment(first.get('dateModified')) > moment(last.get('dateModified')) ? first : last;
    }),
    creatorProfile: Ember.computed.alias('latestAction.creator.profileURL'),
    creatorName: Ember.computed.alias('latestAction.creator.fullName'),

    init() {
        this.get('submission.actions').then(actions => {
            if (actions.length) {
                if (this.get('submission.reviewsState') !== PENDING) {
                    const comment = actions.get('firstObject.comment');
                    this.set('initialReviewerComment', comment);
                    this.set('reviewerComment', comment);
                    this.set('decision', this.get('submission.reviewsState'));
                } else {
                    this.set('initialReviewerComment', '');
                    this.set('reviewerComment', '');
                    this.set('decision', ACCEPTED);
                }
                this.set('noActions', false);
            } else {
                this.set('noActions', true);
            }
            this.set('loadingActions', false);
        });

        return this._super(...arguments);
    },

    statusExplanation: Ember.computed('reviewsWorkflow', 'submission.reviewsState', function() {
        return this.get('submission.reviewsState') === PENDING ?
            MESSAGE[this.get('reviewsWorkflow')] :
            MESSAGE[this.get('submission.reviewsState')];
    }),

    status: Ember.computed('submission.reviewsState', function() {
        return STATUS[this.get('submission.reviewsState')];
    }),

    icon: Ember.computed('submission.reviewsState', function() {
        return ICONS[this.get('submission.reviewsState')];
    }),

    recentActivityLanguage: Ember.computed('noActions', 'submission.reviewsState', function() {
        if (this.get('noActions')) {
            return RECENT_ACTIVITY.automatic[this.get('submission.reviewsState')];
        } else {
            return RECENT_ACTIVITY[this.get('submission.reviewsState')];
        }
    }),

    /* Submission Form */

    initialReviewerComment: '',
    reviewerComment: '',
    decision: 'accepted',

    noComment: Ember.computed('reviewerComment', function() {
        return Ember.isBlank(this.get('reviewerComment'));
    }),

    settingsComments: Ember.computed('reviewsCommentsPrivate', function() {
        let commentType = this.get('reviewsCommentsPrivate') ? 'private' : 'public';
        return SETTINGS['comments'][commentType];
    }),
    settingsNames: Ember.computed('reviewsCommentsAnonymous', function() {
        let commentType = this.get('reviewsCommentsAnonymous') ? 'anonymous' : 'named';
        return SETTINGS['names'][commentType];
    }),
    settingsModeration: Ember.computed('reviewsWorkflow', function() {
        return SETTINGS['moderation'][this.get('reviewsWorkflow')];
    }),

    settingsCommentsIcon: Ember.computed('reviewsCommentsPrivate', function() {
        let commentType = this.get('reviewsCommentsPrivate') ? 'private' : 'public';
        return SETTINGS_ICONS['comments'][commentType];
    }),
    settingsNamesIcon: Ember.computed('reviewsCommentsAnonymous', function() {
        let commentType = this.get('reviewsCommentsAnonymous') ? 'anonymous' : 'named';
        return SETTINGS_ICONS['names'][commentType];
    }),
    settingsModerationIcon: Ember.computed('reviewsWorkflow', function() {
        return SETTINGS_ICONS['moderation'][this.get('reviewsWorkflow')];
    }),

    acceptExplanation: Ember.computed('reviewsWorkflow', function() {
        return DECISION_EXPLANATION['accept'][this.get('reviewsWorkflow')];
    }),
    rejectExplanation: Ember.computed('reviewsWorkflow', function() {
        return DECISION_EXPLANATION['reject'][this.get('reviewsWorkflow')];
    }),

    labelDecisionDropdown: Ember.computed('submission.reviewsState', function() {
        return this.get('submission.reviewsState') === PENDING ?
            'components.preprint-status-banner.decision.make_decision' :
            'components.preprint-status-banner.decision.modify_decision'
    }),
    labelDecisionHeader: Ember.computed('submission.reviewsState', function() {
        return this.get('submission.reviewsState') === PENDING ?
            'components.preprint-status-banner.decision.header.submit_decision' :
            'components.preprint-status-banner.decision.header.modify_decision'
    }),
    labelDecisionBtn: Ember.computed('submission.reviewsState', 'decision', 'reviewerComment', function() {
        if (this.get('submission.reviewsState') === PENDING ) {
            return 'components.preprint-status-banner.decision.btn.submit_decision';
        } else if (this.get('submission.reviewsState') !== this.get('decision')) {
            return 'components.preprint-status-banner.decision.btn.modify_decision';
        } else if (this.get('reviewerComment').trim() !== this.get('initialReviewerComment')) {
            return 'components.preprint-status-banner.decision.btn.update_comment';
        }
        return 'components.preprint-status-banner.decision.btn.modify_decision';

    }),

    commentEdited: Ember.computed('reviewerComment', 'initialReviewerComment', function() {
        return this.get('reviewerComment').trim() !== this.get('initialReviewerComment');
    }),

    decisionChanged: Ember.computed('submission.reviewsState', 'decision', function() {
        return this.get('submission.reviewsState') !== this.get('decision');
    }),

    btnDisabled: Ember.computed('decisionChanged', 'commentEdited', 'saving', function() {
        if (this.get('saving') || (!this.get('decisionChanged') && !this.get('commentEdited'))) {
            return true;
        }
        return false;
    }),

    actions: {
        submit() {
            let trigger = '';
            if (this.get('submission.reviewsState') !== PENDING && (this.get('commentEdited') && !this.get('decisionChanged'))) {
                trigger = 'edit_comment';
            } else {
                trigger = this.get('decision') === ACCEPTED ? 'accept' : 'reject';
            }

            let comment = this.get('reviewerComment').trim();
            this.get('submitDecision')(trigger, comment, this.get('decision'));
        },
        cancel() {
            this.set('decision', this.get('submission.reviewsState'));
            this.set('reviewerComment', this.get('initialReviewerComment'));
        }
    }
});
