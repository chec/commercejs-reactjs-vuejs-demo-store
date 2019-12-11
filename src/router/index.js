import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: 'landing-page',
      component: () => import("@/components/LandingPage")
    },
    {
      path: "/products",
      name: 'products',
      component: () => import("@/components/Products"),
    },
    {
      path: "/cart-checkout",
      name: 'cart-checkout',
      component: () => import("@/components/CartCheckout"),
    },
    {
      path: "/thank-you",
      name: 'order-detail',
      component: () => import("@/components/ThankYou"),
    }
  ]
})
