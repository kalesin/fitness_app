import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

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
    SET_SEARCH_RESPONSE(state, payload) {
        state.responseData = payload.data.parsed[0].food;
        state.nutrients = {
            NAME: state.responseData.label,
            ENERGY: state.responseData.nutrients.ENERC_KCAL || 0,
            CARB: state.responseData.nutrients.CHOCDF || 0,
            FAT: state.responseData.nutrients.FAT || 0,
            FIBER: state.responseData.nutrients.FIBTG || 0,
            PROTEIN: state.responseData.nutrients.PROCNT || 0
        };
        state.nutrientsArray = [
            state.nutrients.ENERGY,
            state.nutrients.PROTEIN,
            state.nutrients.CARB,
            state.nutrients.FAT,
            state.nutrients.FIBER
        ];
    },
    ADD_ITEM(state) {
        state.addedItems.push({
            NAME: state.nutrients.NAME,
            NUTRIENTS: state.nutrientsArray,
            QUANTITY: parseFloat(state.quantity),
            CALCULATED_NUTRIENTS: state.nutrientsArray.map(
                x => Math.round(x * state.quantity * 100) / 100
            )
        });
        state.quantity = 0;
    },
    CHANGE_ITEM(state, { item, index }) {
        state.addedItems[index] = item;
    },
    REMOVE_ITEM(state, { index }) {
        state.addedItems.splice(index, 1);
    },
    SET_QUERY(state, value) {
        state.query = value;
    },
    SET_QUANTITY(state, value) {
        state.quantity = value;
    }


};

const actions = {
    searchFood({ state, getters, commit }, payload) {
        return axios
            .get(
                `${state.api_url}ingr=${state.query}&app_id=${state.api_id}&app_key=${state.api_key}`
            )
            .then(
                response => {
                    console.log(response);
                    commit("SET_SEARCH_RESPONSE", response)

                }
            ).catch(function (error) {
                console.log(error);
            })
    },
    addItem({ state, commit }) {
        commit("ADD_ITEM")
        console.log(state.addedItems);
    },
    onChanged({ state, commit }, { item, index, quantity}) {
        item.QUANTITY = parseFloat(quantity);
        item.CHANGED_QUANTITY = 0;

        item.CALCULATED_NUTRIENTS = item.NUTRIENTS.map(
            x => Math.round(x * item.QUANTITY * 100) / 100
        );
        commit("CHANGE_ITEM", { item, index })

        console.log(state.addedItems);
    },
    onRemoved({ state, commit }, { index }) {
        commit("REMOVE_ITEM", { index })
    },
    setQuery({ state, commit }, value) {
        commit("SET_QUERY", value)
    },
    setQuantity({ state, commit }, value) {
        commit("SET_QUANTITY", value)
    }

};

const getters = {
    totalForToday(state) {
        let totalNutrient = [];
        for (let j = 0; j < 5; j++) {
            totalNutrient[j] = 0;
            for (let i = 0; i < state.addedItems.length; i++) {
                totalNutrient[j] += state.addedItems[i].CALCULATED_NUTRIENTS[j];
            }
            totalNutrient[j] = Math.round(totalNutrient[j] * 100) / 100;
        }
        console.log(totalNutrient);
        return totalNutrient;
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});