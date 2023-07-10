<template>
  <div>
    <div v-for="(menu, index) in userMenu" :key="index">
    <!-- 
      有子项才需要渲染为一个模块列表
      其中 menu.children[0].menuType == 1 这个判断条件是为了避免 tree-menu 递归 children 时全是按钮，都不符合渲染条件从而渲染不出东西，但外层却出现了列表的情况
      可以这么判断是因为按钮不会同菜单一起出现在 children 中，只要一个是按钮就都是按钮
      index 属性在 el-sub-menu 中并不会起到跳转的作用，这里加上是为了消除警告
     -->
    <el-sub-menu
      v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1"
      :key="menu._id" :index="menu.path"
    >
      <template #title>
        <!-- <class-icon :icon="menu.icon"></class-icon> -->
        <el-icon>
          <component :is="getIconName(menu.icon)"></component>
        </el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
      <!-- 递归实现树形渲染 -->
      <tree-menu :userMenu="menu.children" />
    </el-sub-menu>
    <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="menu.path">{{ menu.menuName }}</el-menu-item>
  </div>
</div>
</template>

<script>
  // import ClassIcon from './ClassIcon.vue'

  export default {
    name: 'TreeMenu',
    // components: { ClassIcon },
    props: {
      userMenu: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      /**
       * 目前用的 mock 接口返回的 icon 是 el-icon-setting 这样有 el-icon- 前缀的
       * 而我们需要的是 Setting 这样首字母大写的，所以这里将获得的 icon 转为我们需要的格式
       * 等后面开发后台接口时，再对 icon 形式做出调整，到时直接传给 component 即可，都无需该方法了
       */
      getIconName (icon) {
        const nameList = icon.split('-').pop().split('')
        nameList[0] = nameList[0].toUpperCase()
        return nameList.join('')
      }
    }
  }
</script>
