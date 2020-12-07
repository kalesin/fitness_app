import Vue from 'vue';
import Vuex from 'vuex';

import searchAndAdd from './modules/searchAndAdd'
import other from './modules/other'
import logged from './modules/logged'
import firebase from './modules/firebase'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        searchAndAdd: searchAndAdd,
        searchAndAdd2: searchAndAdd,
        searchAndAdd3: searchAndAdd,
        searchAndAdd4: searchAndAdd,
        other: other,
        firebase: firebase,
        logged: logged,

    }
});