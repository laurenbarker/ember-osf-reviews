import Ember from 'ember';

const SUBMIT = 'submit';
const ACCEPT = 'accept';
const REJECT = 'reject';
const EDIT_COMMENT = 'edit_comment';

const ICONS = Object.freeze({
    [SUBMIT]: 'fa-hourglass-o',
    [ACCEPT]: 'fa-check-circle-o',
    [REJECT]: 'fa-times-circle-o',
    [EDIT_COMMENT]: 'fa-comment-o',
});

const CLASS_NAMES = Object.freeze({
    [SUBMIT]: 'submit-icon',
    [ACCEPT]: 'accept-icon',
    [REJECT]: 'reject-icon',
    [EDIT_COMMENT]: 'edit-comment-icon',
});

/**
 * Display a single review log on the dashboard feed
 *
 * Sample usage:
 * ```handlebars
 * {{review-log-feed-entry log=log}}
 * ```
 * @class review-log-feed-entry
 */
export default Ember.Component.extend({
    i18n: Ember.inject.service(),

    click(event) {
        if (!event.originalEvent.target.href) {
            this.get('toDetail')(this.get('log.provider'), this.get('log.reviewable'));
            return true;
        }
    },

    iconClass: Ember.computed('log.action', function() {
        return CLASS_NAMES[this.get('log.action')];
    }),

    icon: Ember.computed('log.action', function() {
        return ICONS[this.get('log.action')];
    }),

    message: Ember.computed('log.action', 'log.provider', function() {
        const i18n = this.get('i18n');
        return i18n.t(`dashboard.log_message.${this.get('log.action')}`, {
            providerName: this.get('log.provider.name'),
            documentType: i18n.t(`documentType.${this.get('log.provider.preprintWord')}.singular`),
        });
    }),
});
