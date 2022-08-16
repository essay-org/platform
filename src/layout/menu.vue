<template>
  <div class="menu" :style="{ height: isSideMenu ? 'calc(100vh - 64px)' : '' }">
    <a-menu
      v-model:selected-key="state.selectedKeys"
      :open-keys="isSideMenu ? state.openKeys : []"
      :mode="isSideMenu ? 'inline' : 'horizontal'"
      :collapsed="props.collapsed"
      collapsible
      @click="clickMenuItem"
    >
    <template v-for="item in menus" :key="item.name || item.fullPath">
      <menu-item :menu="item"></menu-item>
    </template>
    </a-menu>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { reactive } from "@vue/reactivity";
import { computed, watch } from "@vue/runtime-core";
import MenuItem from './menuItem.vue'

export default {
  components: {
    MenuItem,
  },
  props: {
    collapsed: {
      type: Boolean
    }
  },
  setup(props) {

    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    const state = reactive({
      openKeys: [],
      selectedKeys: [route.name],
    });

    // 可显示菜单排序
    const menus = computed(() => {
      return [...userStore.menus]
        .filter((n) => !n.meta?.hideInMenu)
        .sort((a, b) => (a?.meta?.orderNum || 0) - (b?.meta?.orderNum || 0));
    });
    console.log(menus.value)
    const isSideMenu = computed(() => true);

    const getTargetMenu = (activeMenu) => {
      return router
        .getRoutes()
        .find((n) => [n.name, n.path].includes(activeMenu));
    };

    // TODO:功能确认
    const getOpenKeys = () => {
      const meta = route.meta;
      if (meta?.activeMenu) {
        const targetMenu = getTargetMenu(meta.activeMenu);
        return targetMenu?.meta?.namePath ?? [meta?.activeMenu];
      } else {
        const name =
          route.meta?.namePath ?? route.matched.slice(1).map((n) => n.name);
        return meta?.hideInMenu ? state.openKeys : name;
      }
    };

    watch(
      () => props.collapsed,
      (collapsed) => {
        state.openKeys = collapsed ? [] : getOpenKeys();
      }
    );

    // 根据路由变化切换菜单高亮
    watch(
      () => route.fullPath,
      () => {
        if (route.name === "Login" || props.collapsed) return;
        state.openKeys = getOpenKeys();
                // debugger

        if (route.meta?.activeMenu) {
          const targetMenu = getTargetMenu(route.meta.activeMenu);
          state.selectedKeys = [targetMenu?.name ?? meta?.activeMenu];
        } else {
          state.selectedKeys = [route.meta.activeMenu ?? route.name];
        }
      },
      { immediate: true }
    );

    const clickMenuItem = ({ key }) => {
      if (key === route.name) return;
      if (/http(s)?:/.test(key)) {
        window.open(key);
      } else {
        router.push({ name: key });
      }
    };
    return {
      props,
      menus,
      state,
      isSideMenu,
      clickMenuItem,
    };
  },
};
</script>

<style lang="less" scoped>
.menu {
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
