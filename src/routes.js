import Home from './components/Home.vue';
import Header from './components/Header.vue'
import Calories from './components/calories/Calories.vue'
import Recipes from './components/recipes/Recipes.vue'
import Calendar from './components/calendar/CalendarMonth.vue'

export const routes = [
    { path: '/home', component: Home},
    { path : '/header', component: Header},
    { path: '/calories', component: Calories},
    { path: '/recipes', component: Recipes},
    { path: '/calendar', component: Calendar}
]