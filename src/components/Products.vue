<template>
  <div class="w-100">
    <template v-if="products.length">
      <ProductDetail
        v-for="(product, id) in products.reverse()" :key="id"
        @add-product-to-cart="$emit('add-product-to-cart')"
        :product="product"
      />
    </template>
    <FootPrintsLoading v-else />
  </div>
</template>
<script>
import FootPrintsLoading from './FootPrintsLoading';
import ProductDetail from './ProductDetail';

export default {
  name: "AllProducts",
  props: {
    products: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ProductDetail,
    FootPrintsLoading
  }
}
</script>
