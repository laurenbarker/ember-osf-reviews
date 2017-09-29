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
 *   statusChanged=(action "statusChanged")
 *   pageChanged=(action "pageChanged")
 *   sortChanged=(action "sortChanged")
 *   submissions=submissions
 *   page=page
 *   sort=sort
 *   status=status
 *   loading=loading
 *   totalPages=totalPages
 *   statusCounts=statusCounts
 * }}
 * ```
 * @class moderation-list
 **/
export default Ember.Component.extend({
    statusButtons: [
        {
            status: 'pending',
            iconClass: 'fa-hourglass-o icon-pending',
            labelKey: 'components.moderation-list.pending',
        },
        {
            status: 'accepted',
            iconClass: 'fa-check-circle-o icon-accepted',
            labelKey: 'components.moderation-list.accepted',
        },
        {
            status: 'rejected',
            iconClass: 'fa-times-circle-o icon-rejected',
            labelKey: 'components.moderation-list.rejected',
        },
    ],

    sortOptions: [
        {
            sort: '-date_last_transitioned',
            labelKey: 'components.moderation-list.newest',
        },
        {
            sort: 'date_last_transitioned',
            labelKey: 'components.moderation-list.oldest',
        },
    ],
});
