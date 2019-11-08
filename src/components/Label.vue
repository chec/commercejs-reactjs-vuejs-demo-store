<template>
  <div :class="classes">
    <p class="medium-text ttu gray f6 tracked-mega-1 pb2">
      {{labelTitle || ''}}
    </p>
    <p class="large-title-text f2 font-3-rem-ns fw9 ttu pl3">
      {{body || (placeholder || '')}}
    </p>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Label",
  props: ['labelTitle', 'body', 'placeholder', 'classes'],
}
</script>
