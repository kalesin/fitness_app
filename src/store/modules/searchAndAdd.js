
import axios from 'axios';
import Vue from 'vue';

const searchAndAdd = {
    namespaced: true,
    state: () => ({
        api_key: "4d036c5868dfd862b3d383c4e2d872fc",
        api_id: "8f153d95",
        api_url: "https://api.edamam.com/api/food-database/v2/parser?",
        query: "",
        responseData: 0,
        quantity: 1,
        nutrients: 0,
        nutrientsArray: [],
        addedItems: [],
        itemToAdd: [],
        doneAddingItem: false,
    }),
    mutations: {
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
        CREATE_ITEM_TO_ADD(state, value) {
            state.itemToAdd = {
                NAME: state.nutrients.NAME,
                NUTRIENTS: state.nutrientsArray,
                QUANTITY: 1,
                CHANGED_QUANTITY: "",
                CALCULATED_NUTRIENTS: state.nutrientsArray.map(
                    x => Math.round(x * 1 * 100) / 100
                ),
                IS_PORTION: value
            }
        },
        ITEM_TO_ADD(state, value) {
            state.itemToAdd = value;
        },
        RESET_RESPONSE(state, value) {
            state.responseData = value;
        },
        RESET_ADDED_ITEMS(state, value) {
            state.addedItems = value;
        },
        ADD_ITEM(state) {
            state.addedItems.push(state.itemToAdd);
        },
        ADD_ITEM_VALUE(state, payload) {
            state.addedItems.push(payload);
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
        },
        SET_ADDED_ITEMS(state, payload) {
            state.addedItems = JSON.parse(JSON.stringify(payload));
        },
        SET_DONE_ADDING_ITEM(state, value) {
            state.doneAddingItem = value;
        }
    },
    actions: {
        async searchFood({ state, getters, commit }, payload) {
            return axios
                .get(
                    `${state.api_url}ingr=${state.query}&app_id=${state.api_id}&app_key=${state.api_key}`
                )
                .then(
                    response => {
                        commit("SET_SEARCH_RESPONSE", response)
                        commit("CREATE_ITEM_TO_ADD", false)
                        commit("ADD_ITEM")
                    }
                ).catch(function (error) {
                    console.log(error);
                })
        },
        addItem({ state, commit }) {
            commit("ADD_ITEM")
            commit("SET_QUANTITY", "")
        },
        addItemValue({ state, commit }, payload) {
            commit("ADD_ITEM_VALUE", payload)
        },
        onChanged({ state, commit }, { item, index }) {
            item.QUANTITY = parseFloat(item.CHANGED_QUANTITY);
            item.CHANGED_QUANTITY = "";

            item.CALCULATED_NUTRIENTS = item.NUTRIENTS.map(
                x => Math.round(x * item.QUANTITY * 100) / 100
            );
            commit("CHANGE_ITEM", { item, index })

        },
        onRemoved({ state, commit }, { index }) {
            commit("REMOVE_ITEM", { index })
        },
        setQuery({ state, commit }, value) {
            commit("SET_QUERY", value)
        },
        setQuantity({ state, commit }, value) {
            commit("SET_QUANTITY", value)

            commit("CREATE_ITEM_TO_ADD", false)
        },
        setAddedItems({ state, commit }, payload) {
            commit("SET_ADDED_ITEMS", payload)
        },
        setDoneAddingItem({ state, commit }, value) {
            commit("SET_DONE_ADDING_ITEM", value)
        }
    },
    getters: {
        totalForToday(state) {
            let totalNutrient = [];
            for (let j = 0; j < 5; j++) {
                totalNutrient[j] = 0;
                for (let i = 0; i < state.addedItems.length; i++) {
                    totalNutrient[j] += state.addedItems[i].CALCULATED_NUTRIENTS[j];
                }
                totalNutrient[j] = Math.round(totalNutrient[j] * 100) / 100;
            }
            return totalNutrient;
        },
    }
}

export default searchAndAdd
