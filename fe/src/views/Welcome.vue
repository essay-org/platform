<template>
  <div class="welcome">
    <div class="content">
      <div class="title">通用后台管理系统</div>
      <div class="desc">- Vue3.0 + ElementPlus + Egg + SQLite 打造通用后台管理系统</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script>
  export default {
    name: 'WelcomePage'
  }
</script>

<style lang="less">
  .welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #fff;
    .content {
      position: relative;
      bottom: 40px;
      .sub-title {
        font-size: 30px;
        line-height: 40px;
        color: #333;
      }
      .title {
        font-size: 40px;
        line-height: 62px;
        color: #409eff;
      }
      .desc {
        // text-align: right;
        font-size: 14px;
        color: #999;
      }
    }
    .img {
      background-image: url('../assets/images/welcome.png');
      // 宽高保持与图片实际宽高一致
      width: 371px;
      height: 438px;
      margin-left: 105px;
    }
  }
</style>
