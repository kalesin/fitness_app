
import axios from 'axios';
import Vue from 'vue';


const firebase = {
    namespaced: true,
    state: () => ({
        loggedIn: false,
        userData: [],
        password: "",
        email: "",
        userID: "",
        user: {},
    }),
    mutations: {
        SET_LOGGEDIN(state, value){
            state.loggedIn = value;
        },
        SET_PASSWORD(state, value){
            state.password = value;
        },
        SET_EMAIL(state, value){
            state.email = value;
        },
        SET_USERID(state, value) {
            state.userID = value;
        },
        SET_USER(state, value) {
            state.user = value;
        }
    },
    actions: {
        async getData({ state, commit }, payload) {
            let id = state.userID;
            return Vue.http.get(`data/${id}.json`)
            .then(response => response.json())
                .then(data => {
                    if (data) {
                        const currentRecipeItems = data.currentRecipeItems ? data.currentRecipeItems : [];
                        const todaysItems = data.todaysItems ? data.todaysItems : [];
                        const recipes = data.recipes ? data.recipes : [];
                        const mainCalories = data.userData.maintenanceCalories ? data.userData.maintenanceCalories : 0;
                        const dailyEntries = data.userData.dailyEntries ? data.userData.dailyEntries : [];

                        commit('searchAndAdd/SET_ADDED_ITEMS', todaysItems, { root: true })
                        commit('searchAndAdd2/SET_ADDED_ITEMS', currentRecipeItems, { root: true })
                        commit('other/SET_RECIPES', recipes, {root: true})
                        commit('other/SET_MAINTENANCE_CALORIES', mainCalories, {root: true})
                        commit('other/SET_DAILY_ENTRIES', dailyEntries, {root: true})
                    }
                }).catch(function (error) {
                    console.log(error);
                })
        },
        setLoggedIn({state, commit}, value) {
            commit("SET_LOGGEDIN", value);
        },
        setPassword({state, commit}, value) {
            commit("SET_PASSWORD", value);
        },
        setEmail({state, commit}, value) {
            commit("SET_EMAIL", value);
        },
        setUserID({state, commit, dispatch}, value) {
            commit("SET_USERID", value)
            dispatch("getData")
        },
        setUser({state, commit, dispatch}, value) {
            commit("SET_USER", value)
        },
        
    },
    getters: {
        
    }
}

export default firebase
