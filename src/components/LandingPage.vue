<template>
  <div class="flex flex-grow-1 items-center bg-black pv6">
    <div class="relative w-100 mw9 center ph2 pb4">
      <div class="w-90 o-40 center pv2">
        <LettersHeroBgSvg />
      </div>
      <div class="absolute absolute--fill flex flex-column items-center w-90 center mt6 justify-center">
        <img src="../assets/shoes-hero.png" alt="Pair of Shoes" width="100%" height="auto" />
        <div class="relative absolute--fill flex flex-column justify-center items-center ph3">
          <router-link to="/white-shoe" class="medium-text f7 cherry bg-blossom ttu pv3 ph3 bg-white outline-0 dim pointer self-center no-underline mt1">
            shop products
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LettersHeroBgSvg from '../assets/letters-hero-big.svg'

export default {
  name: 'LandingPage',
  components: {
    LettersHeroBgSvg
  }
}
</script>
