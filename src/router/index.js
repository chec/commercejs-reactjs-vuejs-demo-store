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
      path: "/white-shoe",
      name: 'product-detail',
      component: () => import("@/components/ProductDetail"),
      props: true,
    },
    {
      path: "/cart-checkout",
      name: 'cart-checkout',
      component: () => import("@/components/CartCheckout"),
      props: true,
    },
    {
      path: "/thank-you",
      name: 'order-detail',
      component: () => import("@/components/ThankYou"),
      props: true,
    }
  ]
})
