
import axios from 'axios';
import Vue from 'vue';

const searchAndAdd = {
    namespaced: true,
    state: () => ({
        axios_url: "https://vuejs-stock-trader-f7694.firebaseio.com/data/",
        api_key: "4d036c5868dfd862b3d383c4e2d872fc",
        api_id: "8f153d95",
        api_url: "https://api.edamam.com/api/food-database/v2/parser?",
        query: "",
        responseData: 0,
        quantity: "",
        nutrients: 0,
        nutrientsArray: [],
        addedItems: [],
        items: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: [],
            unsorted: []
        },
        itemsPropNames: ["breakfast", "lunch", "dinner", "snack", "unsorted"],
        itemsIndex: 4,
        itemToAdd: [],
        idx: -1,
        deletedFlag: false,
        responseCount: 0,
        focus: true,
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
        INCREMENT_RESPONSE_COUNT(state) {
            state.responseCount++;
        },
        SET_FOCUS(state, value) {
            state.focus = value;
        },
        CREATE_ITEM_TO_ADD(state, value) {
            state.itemToAdd = {
                NAME: state.nutrients.NAME,
                NUTRIENTS: state.nutrientsArray,
                QUANTITY: 1,
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
        RESET_ADDED_ITEMS(state, userID) {
            state.addedItems = [];
            const data = {
                todaysItems: state.addedItems
            };
            axios.patch(`${state.axios_url}` + `${userID}` + ".json", data)
        },
        RESET_ADDED_ITEMS_RECIPES(state, userID) {
            state.addedItems = [];
            const data = {
                currentRecipeItems: state.addedItems
            };
            axios.patch(`${state.axios_url}` + `${userID}` + ".json", data)
        },
        ADD_ITEM(state, moduleIndex) {
            if (moduleIndex == 1) {
                if (state.itemsIndex == 4) {
                    state.items.unsorted.push(state.itemToAdd)
                } else if (state.itemsIndex == 0) {
                    state.items.breakfast.push(state.itemToAdd)
                } else if (state.itemsIndex == 1) {
                    state.items.lunch.push(state.itemToAdd)
                } else if (state.itemsIndex == 2) {
                    state.items.dinner.push(state.itemToAdd)
                } else if (state.itemsIndex == 3) {
                    state.items.snack.push(state.itemToAdd)
                }
            } else if (moduleIndex == 2) {
                console.log("bbb")
                state.addedItems.push(state.itemToAdd)
            }
        },
        ADD_ITEM_VALUE(state, payload) {
            state.addedItems.push(payload);
        },
        CHANGE_ITEM(state, { item, index }) {
            state.addedItems[index] = item;
        },
        REMOVE_ITEM(state, { index, moduleIndex }) {
            if (moduleIndex == 1) {
                if (state.itemsIndex == 4) {
                    state.items.unsorted.splice(index, 1);
                } else if (state.itemsIndex == 0) {
                    state.items.breakfast.splice(index, 1);
                } else if (state.itemsIndex == 1) {
                    state.items.lunch.splice(index, 1);
                } else if (state.itemsIndex == 2) {
                    state.items.dinner.splice(index, 1);
                } else if (state.itemsIndex == 3) {
                    state.items.snack.splice(index, 1);
                }
            } else if (moduleIndex == 2) {
                state.addedItems.splice(index, 1);
            }
        },
        SET_QUERY(state, value) {
            state.query = value;
        },
        SET_RECIPE_QUERY(state, value) {
            state.queryRecipe = value;
        },
        SET_QUANTITY(state, value) {
            state.quantity = value;
        },
        SET_ADDED_ITEMS(state, payload) {
            state.addedItems = JSON.parse(JSON.stringify(payload));
        },
        SET_INDEX(state, value) {
            state.idx = value
        },
        SET_ITEMS_INDEX(state, value) {
            if (state.itemsIndex == 4) {
                state.itemsIndex = value
            } else if (state.itemsIndex == value) {
                state.itemsIndex = 4
            } else if (state.itemsIndex != value) {
                state.itemsIndex = value
            }
        },
        SET_ITEMS(state, payload) {
            state.items = JSON.parse(JSON.stringify(payload));
        }
    },
    actions: {
        async searchFood({ state, getters, commit }, moduleIndex) {
            return axios
                .get(
                    `${state.api_url}ingr=${state.query}&app_id=${state.api_id}&app_key=${state.api_key}`
                )
                .then(
                    response => {
                        commit("SET_SEARCH_RESPONSE", response)

                        let index = -1; //kateri item je
                        let items = state.items[state.itemsPropNames[state.itemsIndex]];

                        if (items) {
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].NAME === state.responseData.label) {
                                    index = i;
                                }
                            }
                        }
                        if (index != -1) {
                            commit("SET_INDEX", index)
                            commit("INCREMENT_RESPONSE_COUNT")
                            commit("SET_FOCUS", true)
                        } else {
                            commit("CREATE_ITEM_TO_ADD", false)
                            commit("ADD_ITEM", moduleIndex)
                        }

                    }
                ).catch(function (error) {
                    console.log(error);
                })
        },
        addItem({ state, commit }, moduleIndex) {
            commit("ADD_ITEM", moduleIndex)
            commit("SET_QUANTITY", "")
        },
        addItemValue({ state, commit }, payload) {
            let index = state.addedItems.findIndex(element => element.NAME === payload.NAME);
            if (index != -1) {
                commit("SET_INDEX", index)
                commit("INCREMENT_RESPONSE_COUNT")
                commit("SET_FOCUS", true)
            } else {
                commit("ADD_ITEM_VALUE", payload)
            }
        },
        onChanged({ state, commit }, { item, index, userID, moduleIndex, quantity }) {

            if (parseFloat(quantity) > 0 && quantity != '') {
                item.QUANTITY = parseFloat(quantity);
                commit("SET_QUANTITY", "")
                item.CALCULATED_NUTRIENTS = item.NUTRIENTS.map(
                    x => Math.round(x * item.QUANTITY * 100) / 100
                );
                commit("CHANGE_ITEM", { item, index }) //še tole dopolni
            }

            if (moduleIndex == 1) {
                const todaysItems = {
                    unsorted:
                        state.items[state.itemsPropNames[4]],
                    breakfast:
                        state.items[state.itemsPropNames[0]],
                    lunch:
                        state.items[state.itemsPropNames[1]],
                    dinner:
                        state.items[state.itemsPropNames[2]],
                    snack:
                        state.items[state.itemsPropNames[3]],

                };
                axios.patch(`${state.axios_url}` + `${userID}` + "/todaysItems.json", todaysItems)
            } else if (moduleIndex == 2) {
                const data = {
                    currentRecipeItems: state.addedItems
                };
                axios.patch(`${state.axios_url}` + `${userID}` + ".json", data)
            }
        },
        onRemoved({ state, commit }, { index, userID, moduleIndex }) {
            commit("REMOVE_ITEM", { index, moduleIndex })
            if (moduleIndex == 1) {
                const todaysItems = {
                    unsorted:
                        state.items[state.itemsPropNames[4]],
                    breakfast:
                        state.items[state.itemsPropNames[0]],
                    lunch:
                        state.items[state.itemsPropNames[1]],
                    dinner:
                        state.items[state.itemsPropNames[2]],
                    snack:
                        state.items[state.itemsPropNames[3]],
                    
                };
                axios.patch(`${state.axios_url}` + `${userID}` + "/todaysItems.json", todaysItems)
            } else if (moduleIndex == 2) {
                const data = {
                    currentRecipeItems: state.addedItems
                };
                axios.patch(`${state.axios_url}` + `${userID}` + ".json", data)
            }
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
            commit("other/RESET_PORTIONS_AND_NAME", 0, { root: true })
        },
        setFocus({ state, commit }, value) {
            commit("SET_FOCUS", value)
        },
        setItemsIndex({ state, commit }, value) {
            commit("SET_ITEMS_INDEX", value)
        },
        setItems({ state, commit }, payload) {
            commit("SET_ITEMS", payload)
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
