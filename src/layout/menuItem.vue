<template>
  <div class="menu-item">
    <!-- 目录 -->
    <template v-if="isShowSubMenu">
      <a-sub-menu :key="props.menu?.name" v-bind="$attrs">
        <template v-slot:title>
          <span>{{props.menu?.meta?.title}}</span>
        </template>

        <template v-for="item in menuChildren" :key="item.name || item.fullPath">
          <menu-item :menu="item"></menu-item>
        </template>
      </a-sub-menu>
    </template>
    <!-- 菜单 -->
    <template v-else>
     <a-menu-item :key="props.menu?.name">
       <span>{{ props.menu?.meta?.title}}</span>
     </a-menu-item>
    </template>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
// import MenuItem from './menuItem.vue'
export default {
  name: 'MenuItem',
  components: {
  },
  props: {
    menu: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const menuChildren = computed(() => {
      return [...(props.menu?.children || [])].filter(n => !n.meta?.hideInMenu).sort((a, b) => (a?.meta?.orderNum || 0) - (b?.meta?.orderNum || 0))
    })

    const isShowSubMenu = computed(() => {
      return props.menu?.meta?.type === 0 || (!Object.is(props.menu?.meta?.hideChildrenInMenu), true) && props.menu?.children?.length
    })

    return {
      props,
      menuChildren,
      isShowSubMenu
    }
  }
}
</script>

<style lang="less" scoped>

</style>
