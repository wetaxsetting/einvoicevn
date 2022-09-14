<template>
  <v-tooltip bottom :open-on-hover="btnTheme.isIcon">
    <template v-slot:activator="{ on, attrs }">
      <v-btn :block="isBlockBtn" :color="btnColor" :dark="isDark" 
        :depressed="btnTheme.isDepressed" :disabled="isDisabled" 
        :fab="isFab" :fixed="isFixed" :height="btnHeight"
        :icon="btnTheme.isIcon" :large="isLarge" :left="isLeft"
        :loading="isLoading"
        :max-height="btnMaxHeight" :max-width="btnMaxWidth" 
        :min-height="btnMinHeight" :min-width="btnMinWidth"
        :outlined="btnTheme.isOutlined" :plain="isPlain"
        :retain-focus-on-click="isRetainFocusOnClick"
        :right="isRight" :rounded="btnTheme.isRounded"
        :shaped="btnTheme.isShaped"
        :small="isSmall" :text="btnTheme.isText" :tile="btnTheme.isTile"
        :top="isTop" :width="btnWidth" :x-large="isXLarge" :x-small="isXSmall"
        v-bind="attrs" v-on="on" @click="$emit('onClick')">
          <v-icon :color="iconColor">{{ iconName }}</v-icon>
          <span v-if="!btnTheme.isIcon">{{ btnText }}</span>
      </v-btn>
    </template>
    <span>{{ btnText }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'gw-button',
  props: {
    isBlockBtn: Boolean,
    btnColor: String,
    isDark: Boolean,
    btnTheme: Object,
    isDisabled: Boolean,
    isFab: Boolean,
    isFixed: Boolean,
    btnHeight: [ Number, String ],
    isLarge: Boolean,
    isLeft: Boolean,
    isLoading: Boolean,
    btnMaxHeight: [ Number, String ],
    btnMaxWidth: [ Number, String ],
    btnMinHeight: [ Number, String ],
    btnMinWidth: [ Number, String ],
    isPlain: Boolean,
    isRetainFocusOnClick: Boolean,
    isRight: Boolean,
    isSmall: Boolean,
    isTop: Boolean,
    btnWidth: [ Number, String ],
    isXLarge: Boolean,
    isXSmall: Boolean,
    btnText: String,
    btnTextColor: String,
    iconColor: String,
    iconName: String
  },

  data: () => ({

  }),
}
</script>
