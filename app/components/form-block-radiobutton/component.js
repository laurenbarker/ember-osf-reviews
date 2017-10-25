import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    classNames: ['osf-box'],

    title: null,
    description: null,
    value: null,
    // Namespace for radiobuttons
    name: null,

    // Bound attribute
    attribute: null,

    checked: computed('attribute', 'value', function() {
        return this.get('value') === this.get('attribute') ? 'checked' : null;
    }),

    click(event) {
        this.set('attribute', this.get('value'));
        if (event.target.type !== 'radio') {
            event.preventDefault();
            return false;
        }
    },
});
