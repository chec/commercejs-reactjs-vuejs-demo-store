import Vue from 'vue'
import App from './App.vue'
import router from './router'
import commercejs from '@chec/commerce.js'
Vue.config.productionTip = false


// inject commercejs as a plugin, globally
Vue.mixin({
  beforeCreate() {
    this.$commerce = commercejs
  }
})

new Vue({
  router,
  render: h => h(App, { props: { commerce } }),
}).$mount('#app')
