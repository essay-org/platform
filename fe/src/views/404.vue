<template>
  <div class="exception">
    <img src="@/assets/images/404.jpeg" alt="页面不存在" />
    <el-button class="btn-home" @click="goHome">回首页</el-button>
  </div>
</template>

<script>
  export default {
    methods: {
      name: '404',
      goHome () {
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="less">
  .exception {
    position: relative;
    img {
      width: 100%;
      height: 100vh;
    }
    .btn-home {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
