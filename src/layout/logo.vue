<template>
  <div class="logo">
    <img src="@/assets/logo.svg" alt="logo" />
    <h2 v-show="!collapsed" class="title">Platform</h2>
  </div>
</template>

<script>
export default {
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
  },
  setup () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.logo {
  height: 64px;
    padding-left: 24px;
    line-height: 64px;
    display: flex;
    align-items: center;
  img {
    height: 32px;
    margin-right: 8px;
  }
  .title {
    line-height: 1;
    margin: 0;
    color: #fff;
  }
}
</style>
