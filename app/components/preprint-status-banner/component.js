import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import latestAction from 'reviews/utils/latest-action';

const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';

const PRE_MODERATION = 'pre-moderation';
const POST_MODERATION = 'post-moderation';

const COMMENT_LIMIT = 65535;

const ICONS = {
    [PENDING]: 'fa-hourglass-o',
    [ACCEPTED]: 'fa-check-circle-o',
    [REJECTED]: 'fa-times-circle-o',
};

const STATUS = {
    [PENDING]: 'components.preprintStatusBanner.pending',
    [ACCEPTED]: 'components.preprintStatusBanner.accepted',
    [REJECTED]: 'components.preprintStatusBanner.rejected',
};

const MESSAGE = {
    [PRE_MODERATION]: 'components.preprintStatusBanner.message.pendingPre',
    [POST_MODERATION]: 'components.preprintStatusBanner.message.pendingPost',
    [ACCEPTED]: 'components.preprintStatusBanner.message.accepted',
    [REJECTED]: 'components.preprintStatusBanner.message.rejected',
};

const CLASS_NAMES = {
    [PRE_MODERATION]: 'preprint-status-pending-pre',
    [POST_MODERATION]: 'preprint-status-pending-post',
    [ACCEPTED]: 'preprint-status-accepted',
    [REJECTED]: 'preprint-status-rejected',
};

const SETTINGS = {
    comments: {
        public: 'components.preprintStatusBanner.settings.comments.public',
        private: 'components.preprintStatusBanner.settings.comments.private',
    },
    names: {
        anonymous: 'components.preprintStatusBanner.settings.names.anonymous',
        named: 'components.preprintStatusBanner.settings.names.named',
    },
    moderation: {
        [PRE_MODERATION]: 'components.preprintStatusBanner.settings.moderation.pre',
        [POST_MODERATION]: 'components.preprintStatusBanner.settings.moderation.post',
    },
};

const SETTINGS_ICONS = {
    comments: {
        public: 'fa-eye',
        private: 'fa-eye-slash',
    },
    names: {
        anonymous: 'fa-user-secret',
        named: 'fa-user',
    },
    moderation: {
        [PRE_MODERATION]: 'fa-key',
        [POST_MODERATION]: 'fa-globe',
    },
};

const DECISION_EXPLANATION = {
    accept: {
        [PRE_MODERATION]: 'components.preprintStatusBanner.decision.accept.pre',
        [POST_MODERATION]: 'components.preprintStatusBanner.decision.accept.post',
    },
    reject: {
        [PRE_MODERATION]: 'components.preprintStatusBanner.decision.reject.pre',
        [POST_MODERATION]: 'components.preprintStatusBanner.decision.reject.post',
    },
};

const RECENT_ACTIVITY = {
    [PENDING]: 'components.preprintStatusBanner.recentActivity.pending',
    [ACCEPTED]: 'components.preprintStatusBanner.recentActivity.accepted',
    [REJECTED]: 'components.preprintStatusBanner.recentActivity.rejected',
    automatic: {
        [PENDING]: 'components.preprintStatusBanner.recentActivity.automatic.pending',
        [ACCEPTED]: 'components.preprintStatusBanner.recentActivity.automatic.accepted',
    },
};

export default Component.extend({
    i18n: service(),
    theme: service(),

    // translations
    moderator: 'components.preprintStatusBanner.decision.moderator',
    feedbackBaseMessage: 'components.preprintStatusBanner.decision.base',
    commentPlaceholder: 'components.preprintStatusBanner.decision.commentPlaceholder',
    labelAccept: 'components.preprintStatusBanner.decision.accept.label',
    labelReject: 'components.preprintStatusBanner.decision.reject.label',

    classNames: ['preprint-status-component'],

    loadingActions: true,
    noActions: false,

    // Submission form
    initialReviewerComment: '',
    reviewerComment: '',
    decision: 'accepted',

    reviewsWorkflow: alias('submission.provider.reviewsWorkflow'),
    reviewsCommentsPrivate: alias('submission.provider.reviewsCommentsPrivate'),
    reviewsCommentsAnonymous: alias('submission.provider.reviewsCommentsAnonymous'),

    creatorProfile: alias('latestAction.creator.profileURL'),
    creatorName: alias('latestAction.creator.fullName'),

    commentExceedsLimit: computed.gt('reviewerComment.length', COMMENT_LIMIT),

    commentLengthErrorMessage: computed('reviewerComment', function () {
        const i18n = this.get('i18n');
        return i18n.t('components.preprintStatusBanner.decision.commentLengthError', {
            limit: COMMENT_LIMIT,
            difference: Math.abs(COMMENT_LIMIT - this.get('reviewerComment.length')).toString(),
        });
    }),


    statusExplanation: computed('reviewsWorkflow', 'submission.reviewsState', function() {
        return this.get('submission.reviewsState') === PENDING ?
            MESSAGE[this.get('reviewsWorkflow')] :
            MESSAGE[this.get('submission.reviewsState')];
    }),

    status: computed('submission.reviewsState', function() {
        return STATUS[this.get('submission.reviewsState')];
    }),

    icon: computed('submission.reviewsState', function() {
        return ICONS[this.get('submission.reviewsState')];
    }),

    recentActivityLanguage: computed('noActions', 'submission.reviewsState', function() {
        if (this.get('noActions')) {
            return RECENT_ACTIVITY.automatic[this.get('submission.reviewsState')];
        } else {
            return RECENT_ACTIVITY[this.get('submission.reviewsState')];
        }
    }),


    getClassName: computed('reviewsWorkflow', 'submission.reviewsState', function() {
        return this.get('submission.reviewsState') === PENDING ?
            CLASS_NAMES[this.get('reviewsWorkflow')] :
            CLASS_NAMES[this.get('submission.reviewsState')];
    }),

    latestAction: computed('submission.reviewActions.[]', function() {
        return latestAction(this.get('submission.reviewActions'));
    }),

    noComment: computed('reviewerComment', function() {
        return isBlank(this.get('reviewerComment'));
    }),

    settingsComments: computed('reviewsCommentsPrivate', function() {
        const commentType = this.get('reviewsCommentsPrivate') ? 'private' : 'public';
        return SETTINGS.comments[commentType];
    }),
    settingsNames: computed('reviewsCommentsAnonymous', function() {
        const commentType = this.get('reviewsCommentsAnonymous') ? 'anonymous' : 'named';
        return SETTINGS.names[commentType];
    }),
    settingsModeration: computed('reviewsWorkflow', function() {
        return SETTINGS.moderation[this.get('reviewsWorkflow')];
    }),

    settingsCommentsIcon: computed('reviewsCommentsPrivate', function() {
        const commentType = this.get('reviewsCommentsPrivate') ? 'private' : 'public';
        return SETTINGS_ICONS.comments[commentType];
    }),
    settingsNamesIcon: computed('reviewsCommentsAnonymous', function() {
        const commentType = this.get('reviewsCommentsAnonymous') ? 'anonymous' : 'named';
        return SETTINGS_ICONS.names[commentType];
    }),
    settingsModerationIcon: computed('reviewsWorkflow', function() {
        return SETTINGS_ICONS.moderation[this.get('reviewsWorkflow')];
    }),

    acceptExplanation: computed('reviewsWorkflow', function() {
        return DECISION_EXPLANATION.accept[this.get('reviewsWorkflow')];
    }),
    rejectExplanation: computed('reviewsWorkflow', function() {
        return DECISION_EXPLANATION.reject[this.get('reviewsWorkflow')];
    }),

    labelDecisionDropdown: computed('submission.reviewsState', function() {
        return this.get('submission.reviewsState') === PENDING ?
            'components.preprintStatusBanner.decision.makeDecision' :
            'components.preprintStatusBanner.decision.modifyDecision';
    }),
    labelDecisionHeader: computed('submission.reviewsState', function() {
        return this.get('submission.reviewsState') === PENDING ?
            'components.preprintStatusBanner.decision.header.submitDecision' :
            'components.preprintStatusBanner.decision.header.modifyDecision';
    }),
    labelDecisionBtn: computed('submission.reviewsState', 'decision', 'reviewerComment', function() {
        if (this.get('submission.reviewsState') === PENDING) {
            return 'components.preprintStatusBanner.decision.btn.submitDecision';
        } else if (this.get('submission.reviewsState') !== this.get('decision')) {
            return 'components.preprintStatusBanner.decision.btn.modifyDecision';
        } else if (this.get('reviewerComment').trim() !== this.get('initialReviewerComment')) {
            return 'components.preprintStatusBanner.decision.btn.update_comment';
        }
        return 'components.preprintStatusBanner.decision.btn.modifyDecision';
    }),

    commentEdited: computed('reviewerComment', 'initialReviewerComment', function() {
        return this.get('reviewerComment').trim() !== this.get('initialReviewerComment');
    }),

    decisionChanged: computed('submission.reviewsState', 'decision', function() {
        return this.get('submission.reviewsState') !== this.get('decision');
    }),

    btnDisabled: computed('decisionChanged', 'commentEdited', 'saving', 'commentExceedsLimit', function() {
        if (this.get('saving') || (!this.get('decisionChanged') && !this.get('commentEdited')) || this.get('commentExceedsLimit')) {
            return true;
        }
        return false;
    }),

    didInsertElement() {
        this.get('submission.reviewActions')
            .then(latestAction)
            .then(this._handleActions.bind(this));
        return this._super(...arguments);
    },

    actions: {
        submit() {
            let trigger = '';
            if (this.get('submission.reviewsState') !== PENDING && (this.get('commentEdited') && !this.get('decisionChanged'))) {
                trigger = 'edit_comment';
            } else {
                trigger = this.get('decision') === ACCEPTED ? 'accept' : 'reject';
            }

            const comment = this.get('reviewerComment').trim();
            this.get('submitDecision')(trigger, comment, this.get('decision'));
        },
        cancel() {
            this.set('decision', this.get('submission.reviewsState'));
            this.set('reviewerComment', this.get('initialReviewerComment'));
        },
    },

    _handleActions(action) {
        if (action) {
            if (this.get('submission.reviewsState') !== PENDING) {
                const comment = action.get('comment');

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
    },
});
