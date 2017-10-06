import Ember from 'ember';
import ENV from 'reviews/config/environment';


export default Ember.Controller.extend({
    i18n: Ember.inject.service(),
    toast: Ember.inject.service(),

    // Defaults
    reviewsWorkflow: 'pre-moderation',
    reviewsCommentsPrivate: true,
    reviewsCommentsAnonymous: true,

    _t(key, tpl={}) {
        return this.get('i18n').t(`provider_settings.${key}`, tpl);
    },

    _buildOption(setting, option) {
        return {
            value: option,
            title: this._t(`${setting.name}.options.${option}.title`),
            description: this._t(`${setting.name}.options.${option}.description`),
        };
    },

    _buildSetting(setting) {
        return {
            disabled: setting.disabled,
            attributeName: setting.name,
            title: this._t(`${setting.name}.title`),
            description: this._t(`${setting.name}.description`),
            options: setting.options.map(this._buildOption.bind(this, setting)),
        };
    },

    providerSettings: Ember.computed('model', 'reviewsCommentsPrivate', function() {
        let settings = ENV.PROVIDER_SETTINGS.map(this._buildSetting.bind(this));
        // Tie anon comments to private comments
        settings[2].disabled = this.get('reviewsCommentsPrivate');
        return settings;
    }),

    actions: {
        cancel() {
            this.transitionToRoute('index');
            return false;
        },
        submit() {
            ENV.PROVIDER_SETTINGS.forEach(setting => {
                this.set(`model.${setting.name}`, this.get(setting.name));
            });

            // Ignore the value of anon comments if private comments
            // are enabled
            if (this.get('reviewsCommentsPrivate')) {
                this.set('reviewsCommentsAnonymous', true);
            }

            this.get('model').save().catch(() => {
                this.get('model').rollbackAttributes();

                this.get('toast').error(
                    this.get('i18n').t('setup.error.message').toString(),
                    this.get('i18n').t('setup.error.title').toString()
                );
            }).then(() => {
                return this.transitionToRoute('preprints.provider.settings', this.get('model'));
            });
        }
    }
});
