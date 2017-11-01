import moment from 'moment';


export default function latestAction(actions) {
    if (!actions.length) {
        return null;
    }
    // on create, Ember puts the new object at the end of the array
    // https://stackoverflow.com/questions/15210249/ember-data-insert-new-item-at-beginning-of-array-instead-of-at-the-end
    const first = actions.get('firstObject');
    const last = actions.get('lastObject');
    return moment(first.get('dateModified')) > moment(last.get('dateModified')) ? first : last;
}
