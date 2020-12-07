
import axios from 'axios';
import Vue from 'vue';
import {auth, db} from '/home/romank/Coding Projects/Fitness_app/src/scripts/auth.js'

const firebase = {
    namespaced: true,
    state: () => ({
        loggedIn: false,
        userData: [],
        password: "",
        email: "",
        userID: "",
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
        }
    },
    actions: {
        async getData({ state, commit }, payload) {
            let id = state.userID;
            console.log(id);
            return Vue.http.get('data/'+`${id}`+'.json')
            .then(response => response.json())
                .then(data => {
                    console.log(data)
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
        setUserID({state, commit}, value) {
            commit("SET_USERID", value);
            /* auth.onAuthStateChanged(user => {
                if(user) {
                    
                } else {
                    commit("SET_USERID", "");
                }
              }) */
            
        },
        
    },
    getters: {
        
    }
}

export default firebase
