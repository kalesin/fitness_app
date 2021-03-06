
import axios from 'axios';
import Vue from 'vue';

function getMealAtIndex(state, index) {
    if (state.itemsIndex === 0) {
        return state.items.breakfast
    } else if (state.itemsIndex === 1) {
        return state.items.lunch
    } else if (state.itemsIndex === 2) {
        return state.items.dinner
    } else if (state.itemsIndex === 3 || state.itemsIndex === -1) {
        return state.items.snack
    }
}

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
        },
        itemsPropNames: ["breakfast", "lunch", "dinner", "snack"],
        itemsIndex: -1,
        itemToAdd: [],
        dragIndex: -1,
        activeIndex: -1,
        deleted: true

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
                QUANTITY: 100,
                CALCULATED_NUTRIENTS: state.nutrientsArray.map(
                    x => Math.round(x * 100) / 100
                ),
                IS_PORTION: value
            }
        },
        ITEM_TO_ADD(state, value) {
            state.itemToAdd = JSON.parse(JSON.stringify(value));
        },
        RESET_RESPONSE(state, value) {
            state.responseData = value;
        },
        RESET_ADDED_ITEMS(state, userID) {
            state.addedItems = [];
            state.items = {
                breakfast: [],
                lunch: [],
                dinner: [],
                snack: [],
            };
            const data = {
                todaysAddedItems: state.addedItems,
                todaysItems: state.items
            };
            axios.patch(`${state.axios_url}` + `${userID}` + ".json", data)
        },
        ADD_ITEM(state, { moduleIndex, todaysMeal }) {
            if (moduleIndex == 1) {
                let index = todaysMeal.findIndex(element => element.NAME == state.itemToAdd.NAME)
                if (index != -1) {
                    todaysMeal[index].QUANTITY += state.itemToAdd.QUANTITY
                    todaysMeal[index].CALCULATED_NUTRIENTS = todaysMeal[index].NUTRIENTS.map(
                        x => Math.round(x * todaysMeal[index].QUANTITY) / 100)
                } else {
                    todaysMeal.push(state.itemToAdd)
                }
            } else if (moduleIndex == 2) {
                state.addedItems.push(state.itemToAdd)
            }
        },
        ADD_ITEM_VALUE(state, payload) {
            state.itemToAdd = JSON.parse(JSON.stringify(payload));
            /* getMealAtIndex(state, state.itemsIndex).push(payload) */
        },
        CHANGE_ITEM(state, { item, index }) {
            state.addedItems[index] = item;
        },
        REMOVE_ITEM(state, { index, moduleIndex }) {
            if (moduleIndex == 1) {
                switch (state.itemsIndex) {
                    case 0: state.items.breakfast.splice(index, 1); break;
                    case 1: state.items.lunch.splice(index, 1); break;
                    case 2: state.items.dinner.splice(index, 1); break;
                    case 3: state.items.snack.splice(index, 1); break;
                }
            } else if (moduleIndex == 2) {
                state.addedItems.splice(index, 1);
            }
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
        SET_ITEMS(state, payload) {
            let items = JSON.parse(JSON.stringify(payload))
            for (let i = 0; i < 4; i++) {
                let prop = state.itemsPropNames[i];
                state.items[prop] = items[prop] ? items[prop] : []
            }
        },
        SET_ITEMS_INDEX(state, value) {
            if (state.itemsIndex == -1) {
                state.itemsIndex = value
            } else if (state.itemsIndex == value) {
                state.itemsIndex = -1
            } else if (state.itemsIndex != value) {
                state.itemsIndex = value
            }
        },
        SET_DRAG_INDEX(state, value) {
            state.dragIndex = value;
        },
        CHECK_ITEMS_INDEX(state) {
            if (state.itemsIndex == -1) {
                state.itemsIndex = 3
            }
        },
        SET_ACTIVE_INDEX(state, value) {
            state.activeIndex = value;
        },
        SET_DELETED(state, value) {
            state.deleted = value;
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
                        let items = [];

                        if (moduleIndex == 2) {
                            items = state.addedItems
                        } else {
                            items = state.items[state.itemsPropNames[state.itemsIndex]]
                        }

                        if (items) {
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].NAME === state.responseData.label) {
                                    index = i;
                                }
                            }
                        }
                        if (index != -1) {
                            commit("SET_ACTIVE_INDEX", index)
                        } else {
                            commit("CREATE_ITEM_TO_ADD", false)
                            commit("ADD_ITEM", { moduleIndex, todaysMeal: getters.todaysMeal })
                            commit("SET_ACTIVE_INDEX", items.length - 1)
                        }
                    }
                ).catch(function (error) {
                    console.log(error);
                })
        },
        addItem({ state, getters, commit }, moduleIndex) {
            commit("ADD_ITEM", { moduleIndex, todaysMeal: getters.todaysMeal })
        },
        addItemValue({ state, getters, commit }, { payload, moduleIndex }) {
            let items = state.itemsIndex == -1 ? state.items[state.itemsPropNames[3]] : state.items[state.itemsPropNames[state.itemsIndex]];
            let index = items.findIndex(element => element.NAME === payload.NAME);
            if (index != -1) {
                commit("SET_ACTIVE_INDEX", index)
            } else {
                commit("ADD_ITEM_VALUE", payload)
                commit("ADD_ITEM", { moduleIndex, todaysMeal: getters.todaysMeal })
                commit("SET_ACTIVE_INDEX", items.length - 1)
            }
        },
        onChanged({ state, getters, commit }, { item, index, userID, moduleIndex, quantity }) {
            if (parseFloat(quantity) > 0 && quantity != '') {
                if (item.IS_PORTION) {
                    item.QUANTITY = parseFloat(quantity * 100);
                } else {
                    item.QUANTITY = parseFloat(quantity);
                }
                commit("SET_QUANTITY", "")
                item.CALCULATED_NUTRIENTS = item.NUTRIENTS.map(
                    x => Math.round(x * item.QUANTITY) / 100
                );
                commit("CHANGE_ITEM", { item, index }) //še tole dopolni
            }
            commit("SET_ACTIVE_INDEX", -1)

            if (moduleIndex == 1) {
                axios.patch(`${state.axios_url}` + `${userID}` + "/todaysItems.json", getters.todaysItems)
            } else if (moduleIndex == 2) {
                const data = {
                    currentRecipeItems: state.addedItems
                };
                axios.patch(`${state.axios_url}` + `${userID}` + ".json", data)
            }
        },
        onRemoved({ state, getters, commit }, { index, userID, moduleIndex }) {
            commit("REMOVE_ITEM", { index, moduleIndex })
            commit("SET_DELETED", true)
            commit("SET_ACTIVE_INDEX", -1)
            if (moduleIndex == 1) {
                axios.patch(`${state.axios_url}` + `${userID}` + "/todaysItems.json", getters.todaysItems)
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
        },
        setAddedItems({ state, commit }, payload) {
            commit("SET_ADDED_ITEMS", payload)
            commit("other/RESET_PORTIONS_AND_NAME", 0, { root: true })
        },
        setItems({ state, commit }, payload) {
            commit("SET_ITEMS", payload)
        },
        setItemsIndex({ state, commit }, value) {
            commit("SET_ITEMS_INDEX", value)
        },
        dragAndDropItem({ commit }, payload) {
            commit("ITEM_TO_ADD", payload.item)
            commit("SET_DRAG_INDEX", payload.index)
        },
        checkItemsIndex({ commit }) {
            commit("CHECK_ITEMS_INDEX")
        },
        setActiveIndex({ state, commit }, value) {
            if (state.activeIndex != -1 || state.deleted) {
                commit("SET_QUANTITY", "")
                commit("SET_ACTIVE_INDEX", -1)
                commit("SET_DELETED", false)
            } else {
                commit("SET_ACTIVE_INDEX", value)
            }
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
                totalNutrient[j] = Math.round(totalNutrient[j]);
            }
            return totalNutrient;
        },
        todaysItems(state) {
            return {
                breakfast: state.items[state.itemsPropNames[0]],
                lunch: state.items[state.itemsPropNames[1]],
                dinner: state.items[state.itemsPropNames[2]],
                snack: state.items[state.itemsPropNames[3]],
            }
        },
        todaysMeal(state) {
            if (state.itemsIndex === 0) {
                return state.items.breakfast
            } else if (state.itemsIndex === 1) {
                return state.items.lunch
            } else if (state.itemsIndex === 2) {
                return state.items.dinner
            } else if (state.itemsIndex === 3 || state.itemsIndex === -1) {
                return state.items.snack
            }
        }
    }
}

export default searchAndAdd
