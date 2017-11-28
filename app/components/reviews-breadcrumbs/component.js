import { isEmpty } from '@ember/utils';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
    i18n: service(),
    classNames: ['breadcrumbs'],

    breadcrumbs: computed('navigator.currentPath', function() {
        // Always include the dashboard breadcrumb
        const breadcrumbs = [{
            name: this.get('i18n').t('dashboard.title'),
            path: 'index',
        }];
        for (const r of this.get('navigator.routeContexts')) {
            // Skip crumbs with no context
            // Skip 'moderation'
            if (isEmpty(r.context) || !Object.keys(r.context).length || r.part === 'moderation') continue;

            // Skip crumbs with the same context as the prior crumb
            if (r.context === breadcrumbs[breadcrumbs.length - 1].context) continue;

            // Prefer model name or title, fall back to the route name
            set(r, 'name', r.context.breadcrumbTitle || (r.context.get && r.context.get('name')) || r.part);

            // Shorten breadcrumb names longer than 4 words
            const breadcrumbName = r.name.split(' ');
            if (breadcrumbName.length > 4) {
                r.name = `${breadcrumbName.slice(0, 4).join(' ')}...`;
            }
            breadcrumbs.push(r);
        }
        return breadcrumbs;
    }),
});
