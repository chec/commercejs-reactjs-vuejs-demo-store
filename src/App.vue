<template>
<div>
    <Header :cart={cart} location={this.props.location} />
    <main id="main" class="flex">
      <router-view />
    </main>
    <footer class="footer flex pa4 bg-black-90 bg-red-m bg-green-l">
        <div class="self-end w-100">
          <p class="medium-text tc cherry">
            © 2019 CHEC PLATFORM/COMMERCEJS
          </p>
        </div>
    </footer>
</div>

</template>

<script>
import Header from './components/Header'
import './styles/application.scss'

export default {
  name: 'app',
  components: {
    Header
  },
  props: {
    commerce: {
      required: true,
      type: Object
    }
  },
  data: function() {
    return {
      products: [],
      cart: null,
      checkout: null,
      order: null
    }
  }
}
</script>
