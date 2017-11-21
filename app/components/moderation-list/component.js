import Component from '@ember/component';
import { inject as service } from '@ember/service';
/**
 * Provides a list of pending, accepted, and rejected submissions.
 * Provides filtering by preprint state and sorting based on the preprint creation date.
 * If number of records in each type exceeds 10, pagination is enabled.
 * Current page for each state is tracked and used by the paginator.
 * Pagination is using the pagination-pager addon
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
 * }}
 * ```
 * @class moderation-list
 * */
export default Component.extend({
    theme: service(),

    classNames: ['content'],

    didReceiveAttrs() {
        this.set('statusButtons', [
            {
                status: 'pending',
                iconClass: 'fa-hourglass-o icon-pending',
                labelKey: 'components.moderationList.pending',
            },
            {
                status: 'accepted',
                iconClass: 'fa-check-circle-o icon-accepted',
                labelKey: 'components.moderationList.accepted',
            },
            {
                status: 'rejected',
                iconClass: 'fa-times-circle-o icon-rejected',
                labelKey: 'components.moderationList.rejected',
            },
        ]);

        this.set('sortOptions', [
            {
                sort: '-date_last_transitioned',
                labelKey: 'components.moderationList.newest',
            },
            {
                sort: 'date_last_transitioned',
                labelKey: 'components.moderationList.oldest',
            },
        ]);
    },
});
