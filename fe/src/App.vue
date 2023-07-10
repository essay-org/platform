<template>
  <!-- 这个 router-view 用于显示顶级路由的组件，如 '/' 对应的 Home 组件 -->
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="less">
  @import '@/assets/styles/reset.css';
  @import '@/assets/styles/index.css';
</style>
