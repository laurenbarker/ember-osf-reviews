import Ember from 'ember';
import loadAll from 'ember-osf/utils/load-relationship';

export default Ember.Route.extend({
    theme: Ember.inject.service(),
    currentUser: Ember.inject.service('currentUser'),

    renderTemplate(controller, model) {
        // We're a special page.
        // Render into the applications outlet rather than the `provider` outlet.
        this.render(this.routeName, {
            controller: controller,
            into: 'application',
            model: model,
        });
    },

    afterModel(preprint) {
        const {location: {origin}} = window;
        let contributors = Ember.A();

        const downloadUrl = [
            origin,
            this.get('theme.isSubRoute') ? `preprints/${this.get('theme.id')}` : null,
            preprint.get('id'),
            'download'
        ]
            .filter(part => !!part)
            .join('/');

        this.set('fileDownloadURL', downloadUrl);

        return preprint.get('provider')
            .then(provider => {
                return Promise.all([
                    provider,
                    preprint.get('node')
                ]);
            })
            .then(([provider, node]) => {
                this.set('node', node);

                return Promise.all([
                    provider,
                    node,
                    preprint.get('license'),
                    loadAll(node, 'contributors', contributors)
                ]);
            })
    },

    setupController(controller, model) {
        controller.setProperties({
            activeFile: model.get('primaryFile'),
            node: this.get('node'),
            fileDownloadURL: this.get('fileDownloadURL'),
        });

        Ember.run.scheduleOnce('afterRender', this, function() {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, [Ember.$('.abstract')[0], Ember.$('#preprintTitle')[0]]]);  // jshint ignore:line
        });

        return this._super(...arguments);
    },

    actions: {
        error(error) {
            if (error && error.errors && Ember.isArray(error.errors)) {
                return this.intermediateTransitionTo('page-not-found');
            }
        },
    }
});
