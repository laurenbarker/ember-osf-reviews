import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';


export default Component.extend({
    showSetup: notEmpty('providersToSetup'),
});
