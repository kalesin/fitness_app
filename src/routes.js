import Home from './components/Home.vue';
import Portfolio from './components/portfolio/Portfolio.vue';
import Stocks from './components/stocks/Stocks.vue';
import Header from './components/Header.vue'
import Calories from './components/calories/Calories.vue'

export const routes = [
    { path: '/', component: Home},
    { path: '/portfolio', component: Portfolio},
    { path: '/stocks', component: Stocks},
    { path : '/header', component: Header},
    { path: '/calories', component: Calories}
]