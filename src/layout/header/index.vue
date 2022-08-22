<template>
  <a-layout-header class="header">
    <a-space :size="20">
      <div class="menu" @click="handleMenu">
        <component :is="menuIcon"></component>
      </div>

      <a-breadcrumb>
        <template
          v-for="(item, index) in menus"
          :key="item?.name || item?.fullPath"
        >
          <a-breadcrumb-item>
            <span>{{ item?.meta?.title }}</span>
            <!-- 子菜单 -->
            <template v-if="item?.children?.length" #overlay>
              <a-menu :selected-keys="getSelectKeys(index)">
                <template v-for="childItem in item" :key="childItem.name">
                  <a-menu-item
                    v-if="
                      !childItem.meta?.hideInMenu &&
                      !childItem.meta?.hideInBreadcrumb
                    "
                    @click="handleMenuItem(childItem)"
                    >{{ childItem.meta?.title }}</a-menu-item
                  >
                </template>
              </a-menu>
            </template>
          </a-breadcrumb-item>
        </template>
      </a-breadcrumb>
    </a-space>

    <a-space :size="20">
      <header-search></header-search>
      <a-dropdown placement="bottomRight">
        <a-avatar :src="userInfo.headImg">{{ userInfo.name }}</a-avatar>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$router.push({ name: 'About' })"
              >关于</a-menu-item
            >
            <a-menu-item @click="handleLogout">退出系统</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-space>
  </a-layout-header>
</template>

<script>
import { computed, createVNode } from "@vue/runtime-core";
import { MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import HeaderSearch from './search.vue'
import { Modal } from 'ant-design-vue'

export default {
  props: {
    collapsed: {
      type: Boolean,
    },
  },
  components: {
    HeaderSearch,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  },
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();
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
            name: "__index",
            meta: {
              title: "首页",
            },
            children: userStore.menus,
          },
          ...paths,
        ];
      }
      return route.matched;
    });

    const getSelectKeys = (routeIndex) => {
      return [menus.value[routeIndex + 1]?.name];
    };

    const menuIcon = computed(() => {
      return props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;
    });

    // 功能确认
    const findLastChild = (route) => {
      if (typeof route?.redirect === "object") {
        const redirectValues = Object.values(route.redirect);
        if (route?.children?.length) {
          const target = route.children.find((n) =>
            redirectValues.some((m) =>
              [n.name, n.path, n.meta?.fullPath].some((v) => v === m)
            )
          );
          return findLastChild(target);
        }
        return redirectValues.find((n) => typeof n === "string");
      } else if (typeof route?.redirect === "string") {
        if (route?.children?.length) {
          const target = route.children.find((n) =>
            [n.name, n.path, n.meta?.fullPath].some(
              (m) => m === route?.redirect
            )
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

    const userInfo = computed(() => userStore.userInfo)
    const handleLogout = () => {
      Modal.confirm({
        title: '确定要退出系统吗',
        icon: createVNode(QuestionCircleOutlined),
        centered: true,
        onOk: async () => {
          await userStore.logout()
          window.localStorage.clear()
          router.replace({
            name: 'Login',
            query: {
              redirect: route.fullPath
            }
          })
        }
      })
    }
    return {
      handleMenu,
      menuIcon,
      handleMenuItem,
      getSelectKeys,
      menus,
      handleLogout,
      userInfo
    };
  },
};
</script>

<style lang="less" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  height: 64px;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.85);
}
</style>
