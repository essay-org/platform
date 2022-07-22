<template>
<router-view v-slot="{ Component }">
  <component :is="Component"></component>
</router-view>
</template>

<script>
import { defineComponent, watchEffect } from "@vue/runtime-core";
import { useRoute } from 'vue-router'
export default defineComponent({
  setup() {
    const route = useRoute()
    watchEffect(() => {
      if(route.meta?.title) {
        document.title = route.meta.title
      }
    })
  }
})
</script>
