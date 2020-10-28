import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import SearchAndAdd from './modules/SearchAndAdd';

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
    //recipes
    addedItemsRecipes: [],
    recipeName: "",
    recipePortions: 0,
    recipes: [],
    addingRecipe: false,
    recipeQuantity: 0,
    //progressbar
    maintenanceCalories: 0,

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
        state.addingRecipe = false;
    },
    ADD_ITEM(state) {
        state.addedItems.push({
            NAME: state.nutrients.NAME,
            NUTRIENTS: state.nutrientsArray,
            QUANTITY: parseFloat(state.quantity),
            CALCULATED_NUTRIENTS: state.nutrientsArray.map(
                x => Math.round(x * state.quantity * 100) / 100
            ),
            IS_PORTION: false
        });
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
    //recipes
    ADD_ITEM_RECIPES(state) {
        state.addedItemsRecipes.push({
            NAME: state.nutrients.NAME,
            NUTRIENTS: state.nutrientsArray,
            QUANTITY: parseFloat(state.quantity),
            CALCULATED_NUTRIENTS: state.nutrientsArray.map(
                x => Math.round(x * state.quantity * 100) / 100
            )
        });
        state.quantity = 0;
    },
    CHANGE_ITEM_RECIPES(state, { item, index }) {
        state.addedItemsRecipes[index] = item;
    },
    REMOVE_ITEM_RECIPES(state,  index ) {
        state.addedItemsRecipes.splice(index, 1);
    },
    ADD_TO_RECIPES(state, { totalRecipes }) {

        state.recipes.push({
            NAME: state.recipeName.recipesName, //vrača objekt ker nisem hotel met property reaktivno v storu
            NUTRIENTS: totalRecipes,
            PORTIONS: state.recipePortions.recipesPortions,
            PORTION_NUTRIENTS: totalRecipes.map(
                x => Math.round(x / state.recipePortions.recipesPortions * 100) / 100
            )
        })
        state.recipeName = "";
        state.recipePortions = 0;
        state.addedItemsRecipes = [];

        console.log(state.recipes)
    },
    ADD_RECIPE_NAME(state, value) {
        state.recipeName = value;
    },
    ADD_RECIPE_PORTIONS(state, value) {
        state.recipePortions = value;
    },
    SWITCH_RECIPE_MODE(state) {
        state.addingRecipe = !state.addingRecipe;
        state.responseData = 0;
    },
    CLOSE_RECIPE_MODE(state) {
        state.addingRecipe = false;
    },
    /* ADD_PORTION_ITEM(state, {index}) {
        state.addedItems.push({
            NAME: state.recipes[index].NAME,
            NUTRIENTS: state.recipes[index].NUTRIENTS,
            QUANTITY: parseFloat(state.recipes[index].PORTIONS),
            CALCULATED_NUTRIENTS: state.recipes[index].NUTRIENTS.map(
                x => Math.round(x * state.recipes[index].PORTIONS * 100) / 100
            )
        });
    }, */
    SET_RECIPE_QUANTITY(state, value) {
        state.recipeQuantity = value;
    },
    ADD_PORTION_OF_RECIPE(state, index) {
        console.log(state.recipes[index]);
        state.addedItems.push({
            NAME: state.recipes[index].NAME,
            NUTRIENTS: state.recipes[index].PORTION_NUTRIENTS,
            QUANTITY: parseFloat(state.recipeQuantity),
            CALCULATED_NUTRIENTS: state.recipes[index].PORTION_NUTRIENTS.map(
                x => Math.round(x * state.recipeQuantity * 100) / 100
            ),
            IS_PORTION: true
        });
        console.log(state.addedItems)

    },
    REMOVE_RECIPES(state, { index }) {
        state.recipes.splice(index, 1);
    },
    SET_MAINTENANCE_CALORIES(state, value) {
        state.maintenanceCalories = parseFloat(value);
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
        commit("SET_QUANTITY", "")
    },
    onChanged({ state, commit }, { item, index }) {
        item.QUANTITY = parseFloat(item.CHANGED_QUANTITY);
        item.CHANGED_QUANTITY = 0;

        item.CALCULATED_NUTRIENTS = item.NUTRIENTS.map(
            x => Math.round(x * item.QUANTITY * 100) / 100
        );
        commit("CHANGE_ITEM", { item, index })

        console.log(state.quantity);
    },
    onRemoved({ state, commit }, { index }) {
        commit("REMOVE_ITEM", { index })
    },
    setQuery({ state, commit }, value) {
        commit("SET_QUERY", value)
    },
    setQuantity({ state, commit }, value) {
        commit("SET_QUANTITY", value)
    },
    //recipes
    addItemRecipes({ state, commit }) {
        commit("ADD_ITEM_RECIPES")
        commit("SET_QUANTITY", "")
    },
    onChangedRecipes({ state, commit }, { item, index }) {
        item.QUANTITY = parseFloat(item.CHANGED_QUANTITY);
        item.CHANGED_QUANTITY = 0;

        item.CALCULATED_NUTRIENTS = item.NUTRIENTS.map(
            x => Math.round(x * item.QUANTITY * 100) / 100
        );
        commit("CHANGE_ITEM_RECIPES", { item, index })

        console.log(state.quantity);
    },
    onRemovedRecipes({ state, commit }, { index }) {
        commit("REMOVE_ITEM_RECIPES", { index })
    },
    nameRecipe({ state, commit }, value) {
        commit("ADD_RECIPE_NAME", value)
        console.log(state.recipeName)
    },
    setPortions({ state, commit }, value) {
        commit("ADD_RECIPE_PORTIONS", value)
        console.log(state.recipePortions)
    },
    addToRecipes({ state, commit }, { totalRecipes }) {
        console.log(state.recipes)
        commit("ADD_TO_RECIPES", { totalRecipes })
    },
    openRecipes({ state, commit }) {
        commit("SWITCH_RECIPE_MODE")
    },
    closeRecipes({ state, commit }) {
        commit("CLOSE_RECIPE_MODE")
    },
    addPortion({ state, commit }, index) {
        commit("ADD_PORTION_ITEM", index)
    },
    setRecipeQuantity({ state, commit }, value) {
        commit("SET_RECIPE_QUANTITY", value )

        console.log(state.recipeQuantity.value)
    },
    addPortionOfRecipe({ state, commit }, index ) {
        commit("ADD_PORTION_OF_RECIPE", index )
    },
    removeRecipe({ state, commit },  index ) {
        commit("REMOVE_RECIPES",  index )
    },
    //progressbar
    setMaintenanceCalories({ state, commit }, value) {
        commit("SET_MAINTENANCE_CALORIES", value);
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
    },
    totalRecipes(state) {
        let totalNutrient = [];
        for (let j = 0; j < 5; j++) {
            totalNutrient[j] = 0;
            for (let i = 0; i < state.addedItemsRecipes.length; i++) {
                totalNutrient[j] += state.addedItemsRecipes[i].CALCULATED_NUTRIENTS[j];
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
    getters,
    modules: {
        SearchAndAdd
    }
});