<template>
  <a-layout class="layout">
    <a-layout-sider
      class="sider"
      v-model:collapsed="collapsed"
      :width="asiderWidth"
      :trigger="null"
      collapsible
    >
    </a-layout-sider>
    <a-layout-header></a-layout-header>
    <a-layout-content></a-layout-content>
    <a-layout-footer></a-layout-footer>
  </a-layout>
</template>

<script>
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const collapsed = ref(false);
    const asiderWidth = computed(() => (collapsed.value ? 80 : 220));

    return {
      asiderWidth,
      collapsed,
    };
  },
});
</script>