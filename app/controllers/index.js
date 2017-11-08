import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
    session: service(),
    currentUser: service(),

    actions: {
        transitionToDetail(provider, reviewable) {
            this.transitionToRoute('preprints.provider.preprint-detail', provider.get('id'), reviewable.get('id'));
        },
        setupProvider(provider) {
            this.transitionToRoute('preprints.provider.setup', provider.id);
        },
    },
});
