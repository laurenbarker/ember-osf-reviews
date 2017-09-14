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
 * Display a single action on the dashboard feed
 *
 * Sample usage:
 * ```handlebars
 * {{action-feed-entry action=action}}
 * ```
 * @class action-feed-entry
 */
export default Ember.Component.extend({
    i18n: Ember.inject.service(),

    click(event) {
        if (!event.originalEvent.target.href) {
            this.get('toDetail')(this.get('action.provider'), this.get('action.target'));
            return true;
        }
    },

    iconClass: Ember.computed('action.actionTrigger', function() {
        return CLASS_NAMES[this.get('action.actionTrigger')];
    }),

    icon: Ember.computed('action.actionTrigger', function() {
        return ICONS[this.get('action.actionTrigger')];
    }),

    message: Ember.computed('action.actionTrigger', 'action.provider', function() {
        const i18n = this.get('i18n');
        return i18n.t(`components.action-feed-entry.action_message.${this.get('action.actionTrigger')}`, {
            providerName: this.get('action.provider.name'),
            documentType: i18n.t(`documentType.${this.get('action.provider.preprintWord')}.singular`),
        });
    }),
});
