import Vue from 'vue';
import Vuex from 'vuex';

import searchAndAdd from './modules/searchAndAdd';
import other from './modules/other'
import firebase from './modules/firebase'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        searchAndAdd: searchAndAdd,
        searchAndAdd2: searchAndAdd,
        other: other,
        firebase: firebase,

    }
});