<template>
  <v-sheet v-bind="$attrs" tile :color="color ? color : null" :class="[flat ? '' : 'elevation-3', additionClasses]" :width="width" :height="height">
    <slot name="default"></slot>
  </v-sheet>
</template>

<script>
export default {
  name: "base-wrapper",

  props: {
    width: {
      type: [String, Number],
      default: "100%"
    },
    height: {
      type: [String, Number],
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    flat: {
      type: Boolean,
      default: true
    },
    additionClasses: {
      type: String,
      default: "overflow-y-auto"
    }
  }
}
</script>