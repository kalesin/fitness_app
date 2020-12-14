import axios from 'axios';
import Vue from 'vue';

const other = {
    namespaced: true,
    state: () => ({
        axios_url: "https://vuejs-stock-trader-f7694.firebaseio.com/data/",
        //recipes
        recipesName: "",
        recipesPortions: 0,
        recipes: [],
        addingRecipe: false,
        recipeQuantity: 0,
        //progressbar
        maintenanceCalories: 0,
        //editing recipes
        itemToAdd: [],
        editIndex: -1,
        ingrEditIndex: -1,
        showRecipe: false,
        ingredientsTemp: [],
        dailyEntries: [],
        entryEditIndex: -1,
        addedItemsTemp: [],
        //calendar
        dailyEntryTemp: {},
        entryTodayIndex: -1,
        replaceDialogue: false,
        editEntries: false,
        daysUnix: [],
        compareCalendar: [],

    }),
    mutations: {

        //recipes
        ADD_TO_RECIPES(state, { totalForToday, addedItems, recipesName, recipesPortions }) {

            state.recipeName = recipesName;
            state.recipePortions = recipesPortions;

            state.recipes.push({
                NAME: state.recipeName, //vrača objekt ker nisem hotel met property reaktivno v storu
                NUTRIENTS: totalForToday,
                PORTIONS: state.recipePortions,
                PORTION_NUTRIENTS: totalForToday.map(
                    x => Math.round(x / state.recipePortions * 100) / 100
                ),
                INGREDIENTS: addedItems
            })
        },
        RESET_PORTIONS_AND_NAME(state){
            state.recipesName = "";
            state.recipesPortions = 0;
        },
        ADD_RECIPE_NAME(state, value) {
            state.recipesName = value
        },
        ADD_RECIPE_PORTIONS(state, value) {
            state.recipesPortions = value
        },
        SWITCH_RECIPE_MODE(state) {
            state.addingRecipe = !state.addingRecipe;
        },
        SET_SHOW_RECIPE(state, value) {
            state.showRecipe = value;
        },
        SET_RECIPE_MODE(state, value) {
            state.addingRecipe = value;
        },
        SET_RECIPE_QUANTITY(state, value) {
            state.recipeQuantity = value;
        },
        ADD_PORTION_OF_RECIPE(state, index) {
            console.log(state.recipes[index]);
            state.itemToAdd = {
                NAME: state.recipes[index].NAME,
                NUTRIENTS: state.recipes[index].PORTION_NUTRIENTS,
                QUANTITY: 1,
                CHANGED_QUANTITY: "",
                CALCULATED_NUTRIENTS: state.recipes[index].PORTION_NUTRIENTS.map(
                    x => Math.round(x * 100) / 100
                ),
                IS_PORTION: true
            };
        },
        REMOVE_RECIPES(state, index) {
            state.recipes.splice(index, 1);
        },
        SET_MAINTENANCE_CALORIES(state, value) {
            state.maintenanceCalories = parseFloat(value);
        },
        SET_EDIT_INDEX(state, index) {
            state.editIndex = index;
        },
        RESET_EDIT_INDEX(state) {
            state.editIndex = -1;
        },
        CHANGE_RECIPE_NAME(state, payload) {
            console.log(payload)
            state.recipes[payload.editIndex].NAME = payload.recipesName;
        },
        CHANGE_RECIPE_PORTIONS(state, payload) {
            state.recipes[payload.editIndex].PORTIONS = payload.recipesPortions;
        },
        CREATE_INGREDIENTS_TEMP(state, index) {
            state.ingredientsTemp = JSON.parse(JSON.stringify(state.recipes[index].INGREDIENTS));
        },
        CHANGE_RECIPE_INGREDIENT(state, payload) {

            payload.item.QUANTITY = parseFloat(payload.item.CHANGED_QUANTITY);
            payload.item.CHANGED_QUANTITY = 0;

            payload.item.CALCULATED_NUTRIENTS = payload.item.NUTRIENTS.map(
                x => Math.round(x * payload.item.QUANTITY * 100) / 100
            );

            state.ingredientsTemp[payload.index] = payload.item;
        },
        REMOVE_INGREDIENT(state, index) {
            state.ingredientsTemp.splice(index, 1);
        },
        SAVE_INGREDIENTS(state, payload) {
            if (!(payload.recipesName === "")) {
                state.recipes[payload.editIndex].NAME = payload.recipesName;
            }
            if (!(payload.recipesPortions === "")) {
                state.recipes[payload.editIndex].PORTIONS = payload.recipesPortions;
            }
            state.recipes[payload.editIndex].INGREDIENTS = payload.addedItems;
            state.recipes[payload.editIndex].NUTRIENTS = payload.totalForToday;
            state.recipes[payload.editIndex].PORTION_NUTRIENTS = payload.totalForToday.map(
                x => Math.round(x / state.recipes[payload.editIndex].PORTIONS * 100) / 100);
        },
        ADD_INGREDIENT(state, payload) {
            state.ingredientsTemp.push(payload.itemToAdd)
        },
        //daily entry list
        SORT_DAILY_ENTRIES(state) {
            state.dailyEntries.sort((a, b) => a.unix - b.unix)
        },
        SET_DAILY_ENTRIES(state, value) {
            state.dailyEntries = value;
        },
        ADD_DAILY_ENTRY(state, payload) {
            state.dailyEntries.push({ date: payload.today, unix: new Date(payload.today.split("-").join(".")).getTime() / 1000, items: payload.addedItems, total: payload.totalForToday })
        },
        SET_RECIPES(state, value) {
            state.recipes = value;
        },
        SET_ENTRY_EDIT_INDEX(state, value) {
            state.entryEditIndex = value;
        },
        DELETE_ENTRY(state, value) {
            state.dailyEntries.splice(value, 1);
        },
        CREATE_ADDEDITEMS_TEMP(state, index) {
            state.addedItemsTemp = JSON.parse(JSON.stringify(state.dailyEntries[state.entryEditIndex].items));
        },
        REMOVE_ADDEDITEM(state, index) {
            state.addedItemsTemp.splice(index, 1);
        },
        SAVE_ADDEDITEMS(state, payload) {
            state.dailyEntryTemp.items = payload.addedItems;
            state.dailyEntryTemp.total = payload.totalForToday;
        },
        //calendar
        SET_DAILY_ENTRY_TEMP(state, payload) {
            state.dailyEntryTemp = { date: payload.date, unix: payload.dateUnix, items: [], total: [0, 0, 0, 0, 0] };
        },
        SET_EDIT_ENTRIES(state, value) {
            state.editEntries = value;
        },
        PUSH_TEMP_TO_ENTRIES(state) {
            state.dailyEntries.push(state.dailyEntryTemp);
        },
        SET_COMPARE_CALENDAR(state, value) {
            state.compareCalendar = value
        },
        SET_DAYS_UNIX(state, value) {
            state.daysUnix = value
        },
        SET_ENTRY_TODAY_INDEX(state, value) {
            state.entryTodayIndex = value;
        },
        OVERWRITE_ENTRY(state) {
            state.dailyEntries.splice(state.entryTodayIndex, 1);
        }
    },
    actions: {

        //recipes
        nameRecipe({ state, commit }, value) {
            commit("ADD_RECIPE_NAME", value)
        },
        setPortions({ state, commit }, value) {
            commit("ADD_RECIPE_PORTIONS", value)
        },
        addToRecipes({ state, commit }, { totalForToday, addedItems, recipesName, recipesPortions, userID}) {
            commit("ADD_TO_RECIPES", { totalForToday, addedItems, recipesName, recipesPortions })
            commit("RESET_PORTIONS_AND_NAME")
            commit("searchAndAdd2/RESET_ADDED_ITEMS_RECIPES", userID, { root: true })
            
            const data = {
                recipes: state.recipes
              };
              axios.patch(`${state.axios_url}`+ `${userID}` + ".json", data)

        },
        openRecipes({ state, commit }) {
            commit("searchAndAdd/RESET_RESPONSE", 0, { root: true })
            commit("SWITCH_RECIPE_MODE")
        },
        showRecipes({ state, commit }, value) {
            /* commit("searchAndAdd2/RESET_RESPONSE", 0, { root: true }) */
            commit("SET_SHOW_RECIPE", value)
        },
        addPortion({ state, commit }, index) {
            commit("ADD_PORTION_ITEM", index)
        },
        setRecipeQuantity({ state, commit }, value) {
            commit("SET_RECIPE_QUANTITY", value)
        },
        addPortionOfRecipe({ state, commit }, index) {
            commit("ADD_PORTION_OF_RECIPE", index)
        },
        createItemToAddObject({ state, commit }, object) {
            commit("searchAndAdd/ITEM_TO_ADD_OBJECT", { object }, { root: true })
        },
        removeRecipe({ state, commit }, {editIndex, userID}) {
            commit("REMOVE_RECIPES", editIndex)
            commit("RESET_EDIT_INDEX")

            const data = {
                recipes: state.recipes
              };
              axios.patch(`${state.axios_url}`+ `${userID}` + ".json", data)
        },
        //progressbar
        setMaintenanceCalories({ state, commit },{ savedCalories, userID}) {
            commit("SET_MAINTENANCE_CALORIES", savedCalories);
            const userData = {
                  maintenanceCalories: state.maintenanceCalories
                }
            axios.patch(`${state.axios_url}`+ `${userID}` + "/userData.json", userData)
        },
        changeRecipeName({ state, commit }, payload) {
            commit("CHANGE_RECIPE_NAME", payload)
        },
        changeRecipePortions({ state, commit }, payload) {
            commit("CHANGE_RECIPE_PORTIONS", payload)
        },
        createIngredientsTemp({ state, commit }, index) {
            commit("CREATE_INGREDIENTS_TEMP", index)
        },
        changeRecipeIngredient({ state, commit }, payload) {
            commit("CHANGE_RECIPE_INGREDIENT", payload)
        },
        removeIngredient({ state, commit }, index) {
            commit("REMOVE_INGREDIENT", index)
        },
        saveIngredients({ state, commit }, payload) {
            commit("SAVE_INGREDIENTS", payload)
            commit("RESET_PORTIONS_AND_NAME")

            const data = {
                recipes: state.recipes
              };
              axios.patch(`${state.axios_url}`+ `${payload.userID}` + ".json", data)
        },
        addIngredient({ state, commit }, payload) {
            commit("ADD_INGREDIENT", payload)
        },
        setEditIndex({ state, commit }, index) {
            commit("SET_EDIT_INDEX", index)
        },
        resetEditIndex({ state, commit }, index) {
            commit("RESET_EDIT_INDEX", index)
        },
        //entries
        addDailyEntry({ state, commit }, payload) {
            commit("ADD_DAILY_ENTRY", payload)
            commit("searchAndAdd/RESET_ADDED_ITEMS", payload.userID, { root: true })
            commit("SORT_DAILY_ENTRIES")
            const userData = {
                dailyEntries: state.dailyEntries
              };
              axios.patch(`${state.axios_url}`+ `${payload.userID}` + "/userData.json", userData)
        },
        overwriteDailyEntry({ state, commit }, payload){
            commit("OVERWRITE_ENTRY")

            commit("ADD_DAILY_ENTRY", payload)
            commit("searchAndAdd/RESET_ADDED_ITEMS", payload.userID, { root: true })
            commit("SORT_DAILY_ENTRIES")
            const userData = {
                dailyEntries: state.dailyEntries
              };
              axios.patch(`${state.axios_url}`+ `${payload.userID}` + "/userData.json", userData)
        },
        setEntryEditIndex({ state, commit }, payload) {
            commit("SET_ENTRY_EDIT_INDEX", payload)
        },
        deleteEntry({ state, commit }, {entryEditIndex, userID}) {
            commit("DELETE_ENTRY", entryEditIndex)
            commit("SET_ENTRY_EDIT_INDEX", -1)
            const userData = {
                dailyEntries: state.dailyEntries
              };
              axios.patch(`${state.axios_url}`+ `${userID}` + "/userData.json", userData)
        },
        createAddedItemsTemp({ state, commit }, index) {
            commit("CREATE_ADDEDITEMS_TEMP", index)
        },
        saveAddedItems({ state, commit }, payload) {
            commit("SAVE_ADDEDITEMS", payload)
            commit("searchAndAdd3/RESET_ADDED_ITEMS", [], {root: true})
            commit("PUSH_TEMP_TO_ENTRIES")
            commit("SET_ENTRY_EDIT_INDEX", -1)
            commit("SORT_DAILY_ENTRIES")
            const userData = {
                dailyEntries: state.dailyEntries
              };
              axios.patch(`${state.axios_url}`+ `${payload.userID}` + "/userData.json", userData)
        },
        //calendar
        setDailyEntryTemp({ state, commit }, payload) {
            commit("SET_DAILY_ENTRY_TEMP", payload)
        },
        setEditEntries({ state, commit }, value) {
            commit("SET_EDIT_ENTRIES", value)
        },
        setDaysUnix({ state, commit }, value) {
            commit("SET_DAYS_UNIX", value)
        },
        setEntryTodayIndex({ state, commit }, value) {
            commit("SET_ENTRY_TODAY_INDEX", value)
        }


    },
    getters: {
        ingredientsTotal(state) {
            let ingredientTotal = [];
            console.log(state.ingredientsTemp);
            for (let j = 0; j < 5; j++) {
                ingredientTotal[j] = 0;
                console.log(state.ingredientsTemp.length);
                for (let i = 0; i < state.ingredientsTemp.length; i++) {
                    console.log(state.ingredientsTemp[i].CALCULATED_NUTRIENTS[j]);
                    ingredientTotal[j] += state.ingredientsTemp[i].CALCULATED_NUTRIENTS[j];
                }
                ingredientTotal[j] = Math.round(ingredientTotal[j] * 100) / 100;
            }
            return ingredientTotal;
        },
        compareCalendar(state) {
            let same = state.daysUnix;
            for (let i = 0; i < same.length; i++) {
                for (let j = 0; j < state.dailyEntries.length; j++) {
                    if (same[i].date === state.dailyEntries[j].date) {
                        same[i] = {
                            ...same[i],
                            entryExists: true,
                            entry: state.dailyEntries[j]
                        };
                    }
                }
            }
            return same;

        }
    }
}
export default other