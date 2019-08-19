import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.use(VueRouter);
const commerce = new window.Commerce(process.env.VUE_APP_COMMERCEJS_PUBLIC_KEY, (process.env.NODE_ENV === 'development') ? true : false);
Vue.config.productionTip = false

new Vue({
  render: h => h(App, { props: { commerce } }),
}).$mount('#app')
