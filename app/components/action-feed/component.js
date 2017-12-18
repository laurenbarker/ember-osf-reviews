import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
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
    i18n: service(),

    currentUser: service(),
    classNames: ['action-feed'],
    page: 0,

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
            const actions = yield this.get('store').query('review-action', {
                page,
                embed: ['target'],
            });
            this.get('actionsList').pushObjects(actions.toArray());
            this.set(
                'totalPages',
                Math.ceil(actions.get('meta.pagination.total') / actions.get('meta.pagination.per_page')),
            );
        } catch (e) {
            this.get('toast')
                .error(this.get('i18n').t('components.actionFeed.errorLoading'));
        }
    }).drop(),
});
