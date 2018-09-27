import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'

import App from './App'
import routes from './routes'

import 'bulma/css/bulma.css'
import 'animate.css/animate.min.css'

Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)

Vue.config.debug = false
Vue.config.devtools = false

const router = new Router({
    scrollBehavior: () => ({
        y: 0
    }),
    routes
})

new Vue({
    router,
    ...App
}).$mount('#app')
