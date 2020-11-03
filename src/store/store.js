import Vue from 'vue';
import Vuex from 'vuex';

import searchAndAdd from './modules/searchAndAdd';
import other from './modules/other'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        searchAndAdd: searchAndAdd,
        searchAndAdd2: searchAndAdd,
        other: other,

    }
});