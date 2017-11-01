import DS from 'ember-data';
import ArrayProxy from '@ember/array/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { bind } from '@ember/runloop';
import $ from 'jquery';
import { Promise as EmberPromise } from 'rsvp';

const { Store } = DS;

export default Store.extend({

    /*
     * Query a hasMany relationship with query params
     *
     * @method queryHasMany
     * @param {Object} model A model instance
     * @param {String} propertyName Name of a hasMany relationship on the model
     * @param {Object} queryParams A hash to be serialized into the query string of the request
     * @returns {ArrayPromiseProxy} Promise-like array proxy, resolves to the records fetched
     */
    queryHasMany(model, propertyName, queryParams) {
        // TODO: move queryHasMany to ember-osf (MOD-176)
        const reference = model.hasMany(propertyName);
        const promise = new EmberPromise((resolve, reject) => {
            // HACK: ember-data discards/ignores the link if an object on the belongsTo side
            // came first. In that case, grab the link where we expect it from OSF's API
            const url = reference.link() || model.get(`links.relationships.${propertyName}.links.related.href`);
            if (url) {
                $.ajax(url, {
                    data: queryParams,
                    headers: {
                        ACCEPT: 'application/vnd.api+json; version=2.5',
                    },
                    xhrFields: {
                        withCredentials: true,
                    },
                }).catch(reject)
                    .then(bind(this, this.__queryHasManyDone, resolve));
            } else {
                reject(`Could not find a link for '${propertyName}' relationship`);
            }
        });

        const ArrayPromiseProxy = ArrayProxy.extend(PromiseProxyMixin);
        return ArrayPromiseProxy.create({ promise });
    },

    __queryHasManyDone(resolve, payload) {
        this.pushPayload(payload);
        const records = payload.data.map(datum => this.peekRecord(datum.type, datum.id));
        records.meta = payload.meta;
        records.links = payload.links;
        resolve(records);
    },
});
