<template>
  <div class="header">
    <a-layout-header>
      <a-space :size="20">
        <div class="menu" @click="handleMenu">
          <component :is="menuIcon"></component>
        </div>
        <!-- <a-space></a-space> -->
        <a-breadcrumb>
          <template v-for="(item, index) in menus" :key="item.name || item.fullPath">
            <a-breadcrumb-item>
                          <span>{{ item?.meta?.title }}</span>

            </a-breadcrumb-item>
          </template>
        </a-breadcrumb>
      </a-space>
    </a-layout-header>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'

export default {
  props: {
    collapsed: {
      type: Boolean
    }
  },
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  },
  setup (props, {emit}) {

    const handleMenu = () => {
      emit('update:collapsed', !props.collapsed)
    }

    const menuIcon = computed(() => {
      return props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
    })
    return {
      handleMenu,
      menuIcon
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  .menu {
    display: flex;
  }
}
</style>
