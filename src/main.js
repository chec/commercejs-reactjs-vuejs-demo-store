import Vue from 'vue'
import App from './App.vue'
import router from './router'

const commerce = new window.Commerce(process.env.VUE_APP_COMMERCEJS_PUBLIC_KEY, (process.env.NODE_ENV === 'development') ? true : false);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App, { props: { commerce } }),
}).$mount('#app')
