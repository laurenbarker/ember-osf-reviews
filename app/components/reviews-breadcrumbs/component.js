import Ember from 'ember';

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    classNames: ['breadcrumbs'],

    breadcrumbs: Ember.computed('navigator.currentPath', function(){
        // Always include the dashboard breadcrumb
        const breadcrumbs = [{
            name: this.get('i18n').t('dashboard.title'),
            path: 'index',
        }];
        for (const r of this.get('navigator.routeContexts')) {
            // Skip crumbs with no context
            // Skip 'moderation'
            if (Ember.isEmpty(r.context) || !Object.keys(r.context).length || r.part === 'moderation') continue;

            // Skip crumbs with the same context as the prior crumb
            if (r.context === breadcrumbs[breadcrumbs.length - 1].context) continue;

            // Prefer model name or title, fall back to the route name
            r.name = (r.context.get && (r.context.get('name') || r.context.get('title'))) || r.part;

            // Shorten breadcrumb names longer than 4 words
            var breadcrumbName = r.name.split(' ')
            if (breadcrumbName.length > 4) {
                r.name = `${breadcrumbName.slice(0,4).join(' ')}...`;
            }
            breadcrumbs.push(r);
        }
        return breadcrumbs;
    }),
});
