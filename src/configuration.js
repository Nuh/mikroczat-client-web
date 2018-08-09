import * as flattenDeep from 'lodash/flattenDeep';
import * as merge from 'lodash/merge';

export const configuration = {_loaded: false};

export const load = async (urls) => {
    let _urls = flattenDeep([urls]);
    for (let i = 0; i < _urls.length; i++) {
        let url = _urls[i];
        try {
            merge(configuration, await (await fetch(url)).json());
        } catch (e) {
            console.error('Error while loading configuration:', url, e)
        }
    }
    configuration._loaded = true;
    return configuration;
};

export default configuration;

