<template>
  <v-card v-bind="$attrs" dark :color="color" class="d-flex align-center justify-center" height="100%" :width="width" @click="onClick">
    <v-card-text class="pa-1 text-center">
      <GwFlexBox align="center" justify="space-between" v-if="!isOneRow">
        <div id="left-info" v-if="!!$slots.leftInfo">
          <slot name="leftInfo"></slot>
        </div>
        <v-spacer></v-spacer>
        <div id="right-info" v-if="!!$slots.rightInfo">
          <slot name="rightInfo"></slot>
        </div>        
      </GwFlexBox>
      <slot name="default" v-else></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "gw-dashboard-card",

  props: {
    color: String,
    width: [String, Number]
  },

  computed: {
    isOneRow() {
      return (!this.$slots.leftInfo || !this.$slots.rightInfo) ? true : false
    }
  },

  methods: {
    onClick() {
      this.$emit("onClick")
    }
  }
}
</script>