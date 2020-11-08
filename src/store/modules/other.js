

const other = {
    namespaced: true,
    state: () => ({
        //recipes
        recipeName: "",
        recipePortions: 0,
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
        dailyEntries: []

    }),
    mutations: {

        //recipes
        ADD_TO_RECIPES(state, { totalForToday, addedItems }) {

            state.recipes.push({
                NAME: state.recipeName.recipesName, //vrača objekt ker nisem hotel met property reaktivno v storu
                NUTRIENTS: totalForToday,
                PORTIONS: state.recipePortions.recipesPortions,
                PORTION_NUTRIENTS: totalForToday.map(
                    x => Math.round(x / state.recipePortions.recipesPortions * 100) / 100
                ),
                INGREDIENTS: addedItems
            })
            state.recipeName = "";
            state.recipePortions = 0;
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
                QUANTITY: parseFloat(state.recipeQuantity),
                CHANGED_QUANTITY: 0,
                CALCULATED_NUTRIENTS: state.recipes[index].PORTION_NUTRIENTS.map(
                    x => Math.round(x * state.recipeQuantity * 100) / 100
                ),
                IS_PORTION: true
            };

        },
        REMOVE_RECIPES(state, { index }) {
            state.recipes.splice(index, 1);
        },
        SET_MAINTENANCE_CALORIES(state, value) {
            state.maintenanceCalories = parseFloat(value);
        },
        SET_EDIT_INDEX(state, index) {
            state.editIndex = index;
        },
        RESET_EDIT_INDEX(state, index) {
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
            state.recipes[payload.editIndex].INGREDIENTS = state.ingredientsTemp;
            state.recipes[payload.editIndex].NUTRIENTS = payload.ingredientsTotal;
            state.recipes[payload.editIndex].PORTION_NUTRIENTS = payload.ingredientsTotal.map(
                x => Math.round(x / state.recipes[payload.editIndex].PORTIONS * 100) / 100);
        },
        ADD_INGREDIENT(state, payload) {
            state.ingredientsTemp.push(payload.itemToAdd)
        },
        //daily entry list
        ADD_DAILY_ENTRY(state, payload){
            state.dailyEntries.push({date: payload.today, items: payload.addedItems})
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
        addToRecipes({ state, commit }, { totalForToday, addedItems }) {
            commit("ADD_TO_RECIPES", { totalForToday, addedItems })
            commit("searchAndAdd2/RESET_ADDED_ITEMS", [], { root: true })
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
        removeRecipe({ state, commit }, index) {
            commit("REMOVE_RECIPES", index)
        },
        //progressbar
        setMaintenanceCalories({ state, commit }, value) {
            commit("SET_MAINTENANCE_CALORIES", value);
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
        },
        
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
    }
}
export default other