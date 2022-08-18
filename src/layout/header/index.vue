<template>
  <div class="header">
    <a-layout-header>
      <a-space :size="20">
        <div class="menu" @click="handleMenu">
          <component :is="menuIcon"></component>
        </div>
        <!-- <a-space></a-space> -->
        <a-breadcrumb>
          <template
            v-for="(item, index) in menus"
            :key="item.name || item.fullPath"
          >
            <a-breadcrumb-item>
              <span>{{ item?.meta?.title }}</span>
              <!-- 子菜单 -->
              <template v-for="childItem in item" :key="childItem.name">
                <a-menu :selected-keys="getSelectKeys(index)">
                  <a-menu-item
                    v-if="
                      !childItem.meta?.hideInMenu &&
                      !childItem.meta?.hideInBreadcrumb
                    "
                    @click="handleMenuItem(childItem)"
                    >{{ childItem.meta?.title }}</a-menu-item
                  >
                </a-menu>
              </template>
            </a-breadcrumb-item>
          </template>
        </a-breadcrumb>
      </a-space>
    </a-layout-header>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from '@/store/modules/user'

export default {
  props: {
    collapsed: {
      type: Boolean,
    },
  },
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  },
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore()
    const handleMenu = () => {
      emit("update:collapsed", !props.collapsed);
    };

    const menus = computed(() => {
      if (route.meta?.namePath) {
        let children = userStore.menus;
        const paths = route.meta?.namePath?.map((item) => {
          const a = children.find((n) => n.name === item);
          children = a?.children || [];
          return a;
        });
        return [
          {
            name: '__index',
            meta: {
              title: '首页',
            },
            children: userStore.menus,
          },
          ...paths,
        ];
      }
      return route.matched;
    })

    const getSelectKeys = (routeIndex) => {
      return [menus.value[routeIndex + 1]?.name]
    }

    const menuIcon = computed(() => {
      return props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;
    });

    // 功能确认
    const findLastChild = (route) => {
    if (typeof route?.redirect === 'object') {
        const redirectValues = Object.values(route.redirect);
        if (route?.children?.length) {
          const target = route.children.find((n) =>
            redirectValues.some((m) => [n.name, n.path, n.meta?.fullPath].some((v) => v === m)),
          );
          return findLastChild(target);
        }
        return redirectValues.find((n) => typeof n === 'string');
      } else if (typeof route?.redirect === 'string') {
        if (route?.children?.length) {
          const target = route.children.find((n) =>
            [n.name, n.path, n.meta?.fullPath].some((m) => m === route?.redirect),
          );
          return findLastChild(target);
        }
        return route?.redirect;
      }
      return route;
    };

    const handleMenuItem = (item) => {
      const lastChild = findLastChild(item);
      if (lastChild?.name === route.name) return;

      if (/http(s)?:/.test(lastChild?.name)) {
        return window.open(lastChild.name);
      }

      if (lastChild?.name) {
        router.push({ name: lastChild.name });
      }
    };

    return {
      handleMenu,
      menuIcon,
      handleMenuItem,
      getSelectKeys,
    };
  },
};
</script>

<style lang="less" scoped>
.header {
  .menu {
    display: flex;
  }
}
</style>
