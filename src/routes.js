import Home from './components/Home.vue';
import Header from './components/Header.vue'
import Calories from './components/calories/Calories.vue'
import Recipes from './components/recipes/Recipes.vue'
import Calendar from './components/calendar/Calendar.vue'
import Auth from './components/Auth.vue';
import AuthSuccess from './components/AuthSuccess.vue';

export const routes = [/* 
    { path: '/', component: Auth }, */
    { path: '/auth', component: Auth },
    {
        path: '/user', component: AuthSuccess,
        children: [
            { path: '/user/myaccount', component: Home },
            { path: '/user/calories', component: Calories },
            { path: '/user/recipes', component: Recipes },
            { path: '/user/calendar', component: Calendar }
        ]
    },


]