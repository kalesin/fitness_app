
import axios from 'axios';
import Vue from 'vue';

const firebase = {
    namespaced: true,
    state: () => ({
        
    }),
    mutations: {
        
    },
    actions: {
        async getData({ state, commit }, payload) {
            return Vue.http.get('data.json')
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
        
    },
    getters: {
        
    }
}

export default firebase
