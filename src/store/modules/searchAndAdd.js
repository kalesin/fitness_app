
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
        },
        itemsPropNames: ["breakfast", "lunch", "dinner", "snack"],
        itemsIndex: -1,
        itemToAdd: [],
        idx: -1,
        dragIndex: -1,
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
        ADD_ITEM(state, moduleIndex) {
            if (moduleIndex == 1 || moduleIndex == 3) {
                switch (state.itemsIndex) {
                    case 0: let index0 = state.items.breakfast.findIndex(element => element.NAME == state.itemToAdd.NAME)
                        console.log(index0)
                        if (index0 != -1) {
                            state.items.breakfast[index0].QUANTITY += state.itemToAdd.QUANTITY
                            state.items.breakfast[index0].CALCULATED_NUTRIENTS = state.items.breakfast[index0].NUTRIENTS.map(
                                x => Math.round(x * state.items.breakfast[index0].QUANTITY * 100) / 100)
                        } else { state.items.breakfast.push(state.itemToAdd) }
                        break;
                    case 1: let index1 = state.items.lunch.findIndex(element => element.NAME == state.itemToAdd.NAME)
                        if (index1 != -1) {
                            state.items.lunch[index1].QUANTITY += state.itemToAdd.QUANTITY
                            state.items.lunch[index1].CALCULATED_NUTRIENTS = state.items.lunch[index1].NUTRIENTS.map(
                                x => Math.round(x * state.items.lunch[index1].QUANTITY * 100) / 100)
                        } else {
                            state.items.lunch.push(state.itemToAdd)
                        }
                        break;
                    case 2: let index2 = state.items.dinner.findIndex(element => element.NAME == state.itemToAdd.NAME)
                        if (index2 != -1) {
                            state.items.dinner[index2].QUANTITY += state.itemToAdd.QUANTITY
                            state.items.dinner[index2].CALCULATED_NUTRIENTS = state.items.dinner[index2].NUTRIENTS.map(
                                x => Math.round(x * state.items.dinner[index2].QUANTITY * 100) / 100)
                        } else { state.items.dinner.push(state.itemToAdd) }
                        break;
                    case 3:
                        let index3 = state.items.snack.findIndex(element => element.NAME == state.itemToAdd.NAME)
                        if (index3 != -1) {
                            state.items.snack[index3].QUANTITY += state.itemToAdd.QUANTITY
                            state.items.snack[index3].CALCULATED_NUTRIENTS = state.items.snack[index3].NUTRIENTS.map(
                                x => Math.round(x * state.items.snack[index3].QUANTITY * 100) / 100)
                        } else { state.items.snack.push(state.itemToAdd) }
                        break;
                    case -1: let index4 = state.items.snack.findIndex(element => element.NAME == state.itemToAdd.NAME)
                        if (index4 != -1) {
                            state.items.snack[index4].QUANTITY += state.itemToAdd.QUANTITY
                            state.items.snack[index4].CALCULATED_NUTRIENTS = state.items.snack[index4].NUTRIENTS.map(
                                x => Math.round(x * state.items.snack[index4].QUANTITY * 100) / 100)
                        } else { state.items.snack.push(state.itemToAdd) }
                        break;
                }
            } else if (moduleIndex == 2) {
                state.addedItems.push(state.itemToAdd)
            }
        },
        ADD_ITEM_VALUE(state, payload) {
            switch (state.itemsIndex) {
                case 0: state.items.breakfast.push(payload); break;
                case 1: state.items.lunch.push(payload); break;
                case 2: state.items.dinner.push(payload); break;
                case 3: state.items.snack.push(payload); break;
                case -1: state.items.snack.push(payload); break;
            }
        },
        CHANGE_ITEM(state, { item, index }) {
            state.addedItems[index] = item;
        },
        REMOVE_ITEM(state, { index, moduleIndex }) {
            if (moduleIndex == 1 || moduleIndex == 3) {
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
        SET_INDEX(state, value) {
            state.idx = value
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
                            commit("SET_INDEX", index)
                            commit("INCREMENT_RESPONSE_COUNT")
                            commit("SET_FOCUS", true)
                        } else {
                            commit("CREATE_ITEM_TO_ADD", false)
                            commit("ADD_ITEM", moduleIndex)
                            commit("SET_FOCUS", true)
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
            let items = state.itemsIndex == -1 ? state.items[state.itemsPropNames[3]] : state.items[state.itemsPropNames[state.itemsIndex]];
            let index = items.findIndex(element => element.NAME === payload.NAME);
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
        setItems({ state, commit }, payload) {
            commit("SET_ITEMS", payload)
        },
        setFocus({ state, commit }, value) {
            commit("SET_FOCUS", value)
        },
        setItemsIndex({ state, commit }, value) {
            commit("SET_ITEMS_INDEX", value)
        },
        dragAndDropItem({ state, commit }, payload) {
            commit("ITEM_TO_ADD", payload.item)
            commit("SET_DRAG_INDEX", payload.index)
        },
        checkItemsIndex({state, commit}) {
            commit("CHECK_ITEMS_INDEX")
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
