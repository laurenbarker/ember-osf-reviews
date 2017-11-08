import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { translationMacro as t } from 'ember-i18n';
import { task } from 'ember-concurrency';

/**
 * A feed of recent actions for all providers the user has access to
 *
 * Sample usage:
 * ```handlebars
 * {{action-feed}}
 * ```
 * @class action-feed
 */

export default Component.extend({
    store: service(),
    toast: service(),
    currentUser: service(),
    classNames: ['action-feed'],
    page: 0,

    errorMessage: t('components.action-feed.error_loading'),

    dummyActionList: computed(function() {
        return new Array(10);
    }),

    moreActions: computed('totalPages', 'page', function() {
        return this.get('page') < this.get('totalPages');
    }),

    init() {
        this._super(...arguments);
        this.set('actionsList', []);
        this.get('loadActions').perform();
    },

    loadActions: task(function* () {
        this.incrementProperty('page');
        const page = this.get('page');
        try {
            const user = yield this.get('currentUser.user');
            const actions = yield this.get('store').queryHasMany(user, 'actions', {
                page,
                embed: 'target',
            });
            this.get('actionsList').pushObjects(actions.toArray());
            this.set(
                'totalPages',
                Math.ceil(actions.get('meta.total') / actions.get('meta.per_page')),
            );
        } catch (e) {
            this.get('toast').error(this.get('errorMessage'));
        }
    }).drop(),
});
