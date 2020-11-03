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
        itemToAdd: [],
        editMode: false,
        editIndex: -1,
        ingrEditIndex: -1,

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
        SET_EDIT_MODE(state, index) {
            state.editMode = !state.editMode
            state.editIndex = index;
        },
        CHANGE_RECIPE_NAME(state, payload) {
            console.log(payload)
            state.recipes[payload.editIndex].NAME = payload.recipesName;
        },
        CHANGE_RECIPE_PORTIONS(state, payload) {
            state.recipes[payload.editIndex].PORTIONS = payload.recipesPortions;
        },
        CHANGE_RECIPE_INGREDIENT(state, payload) {
            state.recipes[payload.editIndex].INGREDIENTS[payload.index] = payload.item
        },
        SAVE_INGREDIENTS(state, payload) {
            state.recipes[payload.editIndex].NUTRIENTS = payload.ingredientsTotal;
            state.recipes[payload.editIndex].PORTION_NUTRIENTS = payload.ingredientsTotal.map(
                x => Math.round(x / state.recipes[payload.editIndex].PORTIONS * 100) / 100);
        },



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
        openRecipes2({ state, commit }) {
            commit("searchAndAdd2/RESET_RESPONSE", 0, { root: true })
            commit("SWITCH_RECIPE_MODE")
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
        setEditMode({ state, commit }, index) {
            commit("SET_EDIT_MODE", index)
        },
        changeRecipeName({ state, commit }, payload) {
            commit("CHANGE_RECIPE_NAME", payload)
        },
        changeRecipePortions({ state, commit }, payload) {
            commit("CHANGE_RECIPE_PORTIONS", payload)
        },
        changeRecipeIngredient({ state, commit }, payload) {
            payload.item.QUANTITY = parseFloat(payload.item.CHANGED_QUANTITY);
            payload.item.CHANGED_QUANTITY = 0;

            payload.item.CALCULATED_NUTRIENTS = payload.item.NUTRIENTS.map(
                x => Math.round(x * payload.item.QUANTITY * 100) / 100
            );

            commit("CHANGE_RECIPE_INGREDIENT", payload)
        },
        saveIngredients({ state, commit }, payload) {
            commit("SAVE_INGREDIENTS", payload)
        }
    },
    getters: {
        ingredientsTotal(state) {
            let ingredientTotal = [];
            for (let j = 0; j < 5; j++) {
                ingredientTotal[j] = 0;
                console.log("a")
                for (let i = 0; i < state.recipes[state.editIndex].INGREDIENTS.length; i++) {
                    console.log("b")
                    ingredientTotal[j] += state.recipes[state.editIndex].INGREDIENTS[i].CALCULATED_NUTRIENTS[j];
                }
                ingredientTotal[j] = Math.round(ingredientTotal[j] * 100) / 100;
            }
            return ingredientTotal;
        },
    }
}
export default other