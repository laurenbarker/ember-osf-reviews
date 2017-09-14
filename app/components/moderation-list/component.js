import Ember from 'ember';
/**
 * Provides a list of pending, accepted, and rejected submissions. Provides filtering by preprint state and sorting based
 * on the preprint creation date. If number of records in each type exceeds 10, pagination is enabled. Current page for
 * each state is tracked and used by the paginator. Pagination is using the pagination-pager addon
 * (source: https://github.com/knownasilya/pagination-pager).
 *
 * Sample usage:
 * ```handlebars
 * {{moderation-list
 * statusChanged=(action "statusFilterChanged")
 *   pageChanged=(action "pageChanged")
 *   sortChanged=(action "sortChanged")
 *   preprintRecords=model
 *   page=page
 *   sort=sort
 *   status=status
 *   loading=loading
 *   meta=meta
 *   statusCounts=statusCounts
 * }}
 * ```
 * @class moderation-list
 **/
export default Ember.Component.extend({
    store: Ember.inject.service(),
    theme: Ember.inject.service(),
    i18n: Ember.inject.service(),

    //translations
    sortOldestLabel: 'components.moderation-list.oldest',
    sortNewestLabel: 'components.moderation-list.newest',
    sortLabel: 'components.moderation-list.sort',
    noSubmissionsText: 'components.moderation-list.no_submissions',
    pendingLabel: 'components.moderation-list.pending',
    acceptedLabel: 'components.moderation-list.accepted',
    rejectedLabel: 'components.moderation-list.rejected',
});
