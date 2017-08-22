import Ember from 'ember';
import DS from 'ember-data';
import loadAll from 'ember-osf/utils/load-relationship';
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
    theme: Ember.inject.service(),
    toast: Ember.inject.service('toast'),
    currentUser: Ember.inject.service(),
    i18n: Ember.inject.service(),

    savingLog: false,
    fullScreenMFR: false,
    expandedAuthors: true,
    showLicenseText: false,
    expandedAbstract: navigator.userAgent.includes('Prerender'),
    queryParams: {
        chosenFile: 'file'
    },

    logDateLabel: Ember.computed('model.provider.reviewsWorkflow', function() {
        return this.get('model.provider.reviewsWorkflow') === PRE_MODERATION ?
            DATE_LABEL['submitted'] :
            DATE_LABEL['created'];
    }),

    isAdmin: Ember.computed('node', function() {
        // True if the current user has admin permissions for the node that contains the preprint
        return (this.get('node.currentUserPermissions') || []).includes(permissions.ADMIN);
    }),

    // The currently selected file (defaults to primary)
    activeFile: null,
    chosenFile: null,

    disciplineReduced: Ember.computed('model.subjects', function() {
        // Preprint disciplines are displayed in collapsed form on content page
        return this.get('model.subjects').reduce((acc, val) => acc.concat(val), []).uniqBy('id');
    }),

    hasTag: Ember.computed.bool('node.tags.length'),

    authors: Ember.computed('node', function() {
        // Cannot be called until node has loaded!
        const node = this.get('node');

        if (!node)
            return [];

        const contributors = Ember.A();

        return DS.PromiseArray.create({
            promise: loadAll(node, 'contributors', contributors)
                .then(() => contributors)
        });
    }),

    doiUrl: Ember.computed('model.doi', function() {
        return `https://dx.doi.org/${this.get('model.doi')}`;
    }),

    fullLicenseText: Ember.computed('model.license.text', 'model.licenseRecord', function() {
        const text = this.get('model.license.text') || '';
        const {year = '', copyright_holders = []} = this.get('model.licenseRecord');

        return text
            .replace(/({{year}})/g, year)
            .replace(/({{copyrightHolders}})/g, copyright_holders.join(', '));
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
        toggleLicenseText() {
            this.toggleProperty('showLicenseText');
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
        submitDecision(action, comment) {
            this.toggleProperty('savingLog');

            let log = this.store.createRecord('reviewLog', {
               action: action,
               reviewable: this.get('model'),
            });

            if (comment) {
                log.comment = comment;
            }

            return log.save()
                .then(() => {
                    this.transitionToRoute(`preprints.provider.moderation`);
                })
                .catch(() => {
                    this.toggleProperty('savingLog');
                    return this.get('toast')
                        .error(this.get('i18n').t(`components.preprint-status-banner.error`));
                });
        },
    },
});
