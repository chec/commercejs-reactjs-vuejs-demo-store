import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCommercejs from '@chec/commerce-components';

Vue.config.productionTip = false;

Vue.use(VueCommercejs, { commercejsPublicKey: process.env.VUE_APP_COMMERCEJS_PUBLIC_KEY });

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
