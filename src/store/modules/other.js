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
        portionItem: {},
        editIndex: -1,
        dailyEntries: [],
        entryEditIndex: -1,
        addedItemsTemp: [],
        //calendar
        dailyEntryTemp: {},
        entryTodayIndex: -1,
        daysUnix: [],
        compareCalendar: [],
        editDate: ""

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
                INGREDIENTS: addedItems,
                IS_FAVORITE: false
            })
        },
        RESET_PORTIONS_AND_NAME(state) {
            state.recipesName = "";
            state.recipesPortions = 0;
        },
        ADD_RECIPE_NAME(state, value) {
            state.recipesName = value
        },
        ADD_RECIPE_PORTIONS(state, value) {
            state.recipesPortions = value
        },
        SET_RECIPE_QUANTITY(state, value) {
            state.recipeQuantity = value;
        },
        ADD_PORTION_OF_RECIPE(state, index) {
            state.portionItem = {
                NAME: state.recipes[index].NAME,
                NUTRIENTS: state.recipes[index].PORTION_NUTRIENTS,
                QUANTITY: 100,
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
        SAVE_INGREDIENTS(state, payload) {
            if (!(payload.recipesName === "")) {
                state.recipes[payload.editIndex].NAME = payload.recipesName.toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
            }
            if (!(payload.recipesPortions === "")) {
                state.recipes[payload.editIndex].PORTIONS = payload.recipesPortions;
            }
            state.recipes[payload.editIndex].INGREDIENTS = payload.addedItems;
            state.recipes[payload.editIndex].NUTRIENTS = payload.totalForToday;
            state.recipes[payload.editIndex].PORTION_NUTRIENTS = payload.totalForToday.map(
                x => Math.round(x / state.recipes[payload.editIndex].PORTIONS * 100) / 100);
        },
        //daily entry list
        SORT_DAILY_ENTRIES(state) {
            state.dailyEntries.sort((a, b) => a.unix - b.unix)
        },
        SET_DAILY_ENTRIES(state, value) {
            state.dailyEntries = value;
        },
        ADD_DAILY_ENTRY(state, payload) {
            state.dailyEntries.push({ date: payload.today, unix: new Date(payload.today.split("-").join(".")).getTime() / 1000, addedItems: payload.addedItems, items: payload.items, total: payload.totalForToday })
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
        SAVE_ADDEDITEMS(state, payload) {
            state.dailyEntryTemp.items = JSON.parse(JSON.stringify(payload.items))
            state.dailyEntryTemp.addedItems = JSON.parse(JSON.stringify(payload.addedItems))
            state.dailyEntryTemp.total = JSON.parse(JSON.stringify(payload.totalForToday))
        },
        //calendar
        SET_DAILY_ENTRY_TEMP(state, payload) {
            if (state.entryEditIndex != -1) {
                state.dailyEntryTemp = {
                    date: payload.date,
                    unix: payload.unix,
                    items: state.entryEditIndex != -2 ? JSON.parse(JSON.stringify(state.dailyEntries[state.entryEditIndex].items)) : [],
                    addedItems: state.entryEditIndex != -2 ? JSON.parse(JSON.stringify(state.dailyEntries[state.entryEditIndex].addedItems)) : [],
                    total: [0, 0, 0, 0, 0],
                };
            }

        },
        CLEAR_DAILY_ENTRY_TEMP(state) {
            state.dailyEntryTemp = {
                date: null,
                unix: null,
                items: [],
                addedItems: [],
                total: [0, 0, 0, 0, 0],
            };
        },
        PUSH_TEMP_TO_ENTRIES(state) {
            state.dailyEntries.splice(state.entryEditIndex, 1)
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
        },
        SET_EDIT_DATE(state, value) {
            state.editDate = value;
        },
        SET_FAVORITE(state, index) {
            state.recipes[index].IS_FAVORITE = !state.recipes[index].IS_FAVORITE;

            let array = JSON.parse(JSON.stringify(state.recipes));
            let array1 = array.filter(element => element.IS_FAVORITE == true)
            let array2 = array.filter(element => element.IS_FAVORITE == false)

            array = array1.concat(array2);
            state.recipes = JSON.parse(JSON.stringify(array))
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
        addToRecipes({ state, commit }, { totalForToday, addedItems, recipesName, recipesPortions, userID }) {
            commit("ADD_TO_RECIPES", { totalForToday, addedItems, recipesName, recipesPortions })
            commit("searchAndAdd2/SET_ADDED_ITEMS", [], { root: true })
            commit("RESET_PORTIONS_AND_NAME")

            const data = {
                recipes: state.recipes
            };
            axios.patch(`${state.axios_url}` + `${userID}` + ".json", data)

        },
        setRecipeQuantity({ state, commit }, value) {
            commit("SET_RECIPE_QUANTITY", value)
        },
        addPortionOfRecipe({ state, commit }, index) {
            commit("ADD_PORTION_OF_RECIPE", index)
        },
        removeRecipe({ state, commit }, { index, userID }) {
            commit("REMOVE_RECIPES", index)
            commit("RESET_EDIT_INDEX")

            const data = {
                recipes: state.recipes
            };
            axios.patch(`${state.axios_url}` + `${userID}` + ".json", data)
        },
        //progressbar
        setMaintenanceCalories({ state, commit }, { savedCalories, userID }) {
            commit("SET_MAINTENANCE_CALORIES", savedCalories);
            const userData = {
                maintenanceCalories: state.maintenanceCalories
            }
            axios.patch(`${state.axios_url}` + `${userID}` + "/userData.json", userData)
        },
        saveIngredients({ state, commit }, payload) {
            commit("SAVE_INGREDIENTS", payload)
            const data = {
                recipes: state.recipes
            };
            axios.patch(`${state.axios_url}` + `${payload.userID}` + ".json", data)
        },
        setEditIndex({ state, commit }, index) {
            commit("SET_EDIT_INDEX", index)
        },
        //entries
        addDailyEntry({ state, commit }, payload) {
            commit("ADD_DAILY_ENTRY", payload)
            commit("searchAndAdd/RESET_ADDED_ITEMS", payload.userID, { root: true })
            commit("SORT_DAILY_ENTRIES")
            const userData = {
                dailyEntries: state.dailyEntries
            };
            axios.patch(`${state.axios_url}` + `${payload.userID}` + "/userData.json", userData)
        },
        overwriteDailyEntry({ state, commit }, payload) {
            commit("OVERWRITE_ENTRY")

            commit("ADD_DAILY_ENTRY", payload)
            commit("searchAndAdd/RESET_ADDED_ITEMS", payload.userID, { root: true })
            commit("SORT_DAILY_ENTRIES")
            const userData = {
                dailyEntries: state.dailyEntries
            };
            axios.patch(`${state.axios_url}` + `${payload.userID}` + "/userData.json", userData)
        },
        setEntryEditIndex({ state, commit }, payload) {
            commit("SET_ENTRY_EDIT_INDEX", payload)
        },
        deleteEntry({ state, commit }, { entryEditIndex, userID }) {
            commit("DELETE_ENTRY", entryEditIndex)
            commit("SET_ENTRY_EDIT_INDEX", -1)
            const userData = {
                dailyEntries: state.dailyEntries
            };
            axios.patch(`${state.axios_url}` + `${userID}` + "/userData.json", userData)
        },
        saveEntryChanges({ state, commit }, payload) {
            commit("SAVE_ADDEDITEMS", payload)
            commit("searchAndAdd3/RESET_ADDED_ITEMS", payload.userID, { root: true })

            commit("PUSH_TEMP_TO_ENTRIES")
            commit("CLEAR_DAILY_ENTRY_TEMP")

            commit("SET_ENTRY_EDIT_INDEX", -1)
            commit("SORT_DAILY_ENTRIES")
            const userData = {
                dailyEntries: state.dailyEntries
            };
            axios.patch(`${state.axios_url}` + `${payload.userID}` + "/userData.json", userData)
        },
        //calendar
        setDailyEntryTemp({ state, commit }, payload) {
            commit("SET_DAILY_ENTRY_TEMP", payload)
        },
        setDailyEntryItems({ state, commit }, payload) {
            commit("searchAndAdd3/SET_ADDED_ITEMS", payload.addedItems, { root: true })
            commit("searchAndAdd3/SET_ITEMS", payload.items, { root: true })
        },
        setDaysUnix({ state, commit }, value) {
            commit("SET_DAYS_UNIX", value)
        },
        setEntryTodayIndex({ state, commit }, value) {
            commit("SET_ENTRY_TODAY_INDEX", value)
        },
        setEditDate({ state, commit }, value) {
            commit("SET_EDIT_DATE", value)
        },
        setFavorite({ state, commit }, { index, userID }) {
            commit("SET_FAVORITE", index)

            const data = {
                recipes: state.recipes
            };
            axios.patch(`${state.axios_url}` + `${userID}` + ".json", data)
        },


    },
    getters: {
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