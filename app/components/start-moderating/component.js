import Component from '@ember/component';


export default Component.extend({
    tagName: 'button',
    attributeBindings: ['disabled'],
    classNames: ['btn', 'btn-success', 'btn-lg'],

    disabled: false,
    choiceRequired: false,

    selectedProvider: null,

    actions: {
        submit() {
            this.setupProvider(this.get('selectedProvider'));
        },

        cancel() {
            this.set('disabled', false);
            this.set('choiceRequired', false);
        },
    },

    setupProvider(provider) {
        this.set('disabled', true);
        this.get('action')(provider);
    },

    click() {
        if (this.get('providers.length') > 1) {
            this.set('choiceRequired', true);
            this.set('selectedProvider', this.get('providers.firstObject'));
            return;
        }
        this.setupProvider(this.get('providers.firstObject'));
    },
});
