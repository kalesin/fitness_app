import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    api_key: "4d036c5868dfd862b3d383c4e2d872fc",
    api_id: "8f153d95",
    api_url: "https://api.edamam.com/api/food-database/v2/parser?",
    query: "",
    responseData: 0,
    quantity: "",
    nutrients: 0,
    nutrientsArray: [],
    addedItems: [],
    totalNutrients: []
};

const mutations = {
    
};

const actions = {
    
};

const getters = {
    
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});