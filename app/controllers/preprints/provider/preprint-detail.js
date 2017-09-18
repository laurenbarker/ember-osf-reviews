import Ember from 'ember';
import permissions from 'ember-osf/const/permissions';


const DATE_LABEL = {
    created: 'content.date_label.created_on',
    submitted: 'content.date_label.submitted_on'
}
const PRE_MODERATION = 'pre-moderation';

/**
 * @module ember-osf-reviews
 * @submodule controllers
 */

/**
 * @class Moderation Detail Controller
 */
export default Ember.Controller.extend({
    currentUser: Ember.inject.service(),
    i18n: Ember.inject.service(),
    theme: Ember.inject.service(),
    toast: Ember.inject.service(),

    node: Ember.computed.alias('model.node'),

    fullScreenMFR: false,
    savingAction: false,
    showLicense: false,

    _activeFile: null,
    chosenFile: null,

    queryParams: { chosenFile: 'file' },

    hasTags: Ember.computed.bool('node.tags.length'),
    expandedAbstract: navigator.userAgent.includes('Prerender'),

    // The currently selected file (defaults to primary)
    activeFile: Ember.computed('model', {
        get() {
            return this.getWithDefault('_activeFile', this.get('model.primaryFile'));
        },
        set(key, value) {
            return this.set('_activeFile', value);
        }
    }),

    fileDownloadURL: Ember.computed('model', function() {
        const {location: {origin}} = window;
        return [
            origin,
            this.get('theme.isSubRoute') ? `preprints/${this.get('theme.id')}` : null,
            this.get('model.id'),
            'download'
        ].filter(part => !!part).join('/');
    }),

    actionDateLabel: Ember.computed('model.provider.reviewsWorkflow', function() {
        return this.get('model.provider.reviewsWorkflow') === PRE_MODERATION ?
            DATE_LABEL['submitted'] :
            DATE_LABEL['created'];
    }),

    isAdmin: Ember.computed('node', function() {
        // True if the current user has admin permissions for the node that contains the preprint
        return (this.get('node.currentUserPermissions') || []).includes(permissions.ADMIN);
    }),

    hasShortenedDescription: Ember.computed('node.description', function() {
        const nodeDescription = this.get('node.description');

        return nodeDescription && nodeDescription.length > 350;
    }),

    useShortenedDescription: Ember.computed('expandedAbstract', 'hasShortenedDescription', function() {
        return this.get('hasShortenedDescription') && !this.get('expandedAbstract');
    }),

    description: Ember.computed('node.description', function() {
        // Get a shortened version of the abstract, but doesn't cut in the middle of word by going
        // to the last space.
        return this.get('node.description')
            .slice(0, 350)
            .replace(/\s+\S*$/, '');
    }),

    actions: {
        toggleShowLicense() {
            this.toggleProperty('showLicense');
        },
        expandMFR() {
            this.toggleProperty('fullScreenMFR');
        },
        expandAbstract() {
            this.toggleProperty('expandedAbstract');
        },
        chooseFile(fileItem) {
            this.setProperties({
                chosenFile: fileItem.get('id'),
                activeFile: fileItem
            });
        },
        submitDecision(trigger, comment) {
            this.toggleProperty('savingAction');

            let action = this.store.createRecord('action', {
               actionTrigger: trigger,
               target: this.get('model'),
            });

            if (comment) {
                action.comment = comment;
            }

            return action.save()
                .then(() => {
                    // this.get('model.actions').insertAt(0, log);
                    // "I have an idea; let's make arrays not work like arrays" - Ember-Data
                    // this.get('model.actions.content').destroy();
                    this.transitionToRoute(`preprints.provider.moderation`);
                })
                .catch(() => {
                    this.toggleProperty('savingAction');
                    return this.get('toast')
                        .error(this.get('i18n').t(`components.preprint-status-banner.error`));
                });
        },
    },
});
