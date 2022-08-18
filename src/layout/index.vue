<template>
  <a-layout class="layout">
    <a-layout-sider
      class="sider"
      v-model:collapsed="collapsed"
      :width="asiderWidth"
      :trigger="null"
      collapsible
    >
      <aside-logo :collapsed="collapsed"></aside-logo>
      <aside-menu :collapsed="collapsed"></aside-menu>
    </a-layout-sider>

    <a-layout>
      <page-header></page-header>
      <a-layout-content class="content">
        <tabs-view></tabs-view>
      </a-layout-content>
      <page-footer></page-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import TabsView from './tabsView.vue'
import AsideMenu from './menu.vue'
import AsideLogo from './logo.vue'
import PageFooter from './footer/index.jsx'
import PageHeader from './header/index.vue'
export default defineComponent({
  components: {
    TabsView,
    AsideMenu,
    AsideLogo,
    PageHeader,
    PageFooter,
  },
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

<style lang="less" scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  .content {
    flex: none;
  }
}
</style>
