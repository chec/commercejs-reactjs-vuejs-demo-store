<template>
  <div class="FootPrintsLoader fixed absolute-fill w-100 h-100 bg-black-90 flex flex-column items-center justify-center z-max">
    <div class="FootPrintsLoader__prints-container">
     <div v-for="(item, id) in Array.from({length: '8'})" :key="id" class="FootPrintsLoader__print footPrintContainer fill-cherry">
       <FootPrintSvg />
     </div>
    </div>
    <p class="absolute medium-text white f6 ttu">
      <slot>loading...</slot>
    </p>
  </div>
</template>
<script>
import FootPrintSvg from '../assets/foot-print.svg';

export default {
  name: "FootPrintsLoading",
  components: {
    FootPrintSvg
  }
}
</script>
