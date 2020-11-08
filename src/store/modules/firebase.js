
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
                        const currentRecipeItems = data.currentRecipeItems;
                        const todaysItems = data.todaysItems;

                        commit('searchAndAdd/SET_ADDED_ITEMS', todaysItems, { root: true })
                        commit('searchAndAdd2/SET_ADDED_ITEMS', currentRecipeItems, { root: true })
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
