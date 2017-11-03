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
    page: 1,

    errorMessage: t('components.action-feed.error_loading'),

    dummyActionList: computed(function() {
        return new Array(10);
    }),

    moreActions: computed('totalPages', 'page', function() {
        return this.get('page') < this.get('totalPages');
    }),

    init() {
        this._super(...arguments);
        this.setProperties({
            actionsList: [],
            loadingMore: false,
        });
        this.get('loadActions').perform();
    },

    loadActions: task(function* () {
        const page = this.get('page');
        try {
            const results = yield this.get('currentUser.user')
                .then(user => this.get('store').queryHasMany(user, 'actions', { page }));
            this.get('actionsList').pushObjects(results.toArray());
            this.setProperties({
                totalPages: Math.ceil(results.get('meta.total') / results.get('meta.per_page')),
                loadingMore: false,
            });
        } catch (e) {
            this.get('toast').error(this.get('errorMessage'));
        }
    }),

    nextPage() {
        this.incrementProperty('page');
        this.set('loadingMore', true);
        this.get('loadActions').perform();
    },
});
