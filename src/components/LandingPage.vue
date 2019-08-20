<template>
  <div class="flex flex-grow-1 items-center bg-black pv5 pv4-m pv3-l">
    <div class="relative w-100 mw9 center ph2">
      <div class="w-90 o-40 center pv2">
        <LettersHeroBgSvg />
      </div>
      <div class="absolute absolute--fill flex flex-column items-center w-90 center mt5">
        <img src="../assets/shoes-hero.png" alt="Shoes Hero" width="100%" height="auto" />
      </div>
      <div class="absolute absolute--fill flex flex-column justify-center items-center nb7 ph3">
        <p class="flex flex-shrink-1 flex-column hero-text f3 f2-m f1-l white tr lh-title">
          LOREM IPSUM LOREM IPSUM
          <router-link to="/white-shoe" class="medium-text f7 cherry bg-blossom ttu pv3 ph3 bg-white outline-0 dim pointer mw4 self-end mr3 no-underline">
            shop shoe
          </router-link>
        </p>
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
