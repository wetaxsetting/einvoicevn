<template>
  <v-app>
    <client-only>
      <notifications></notifications>
    </client-only>

    <v-main v-resize="onResize">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'monitoring',
  data:()=>({})
}
</script>