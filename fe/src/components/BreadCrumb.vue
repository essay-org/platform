<template>
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- router 中的元数据在这里发挥作用了 -->
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
      <router-link v-if="index == 0" to="/welcome">{{ item.meta.title }}</router-link>
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
  export default {
    name: 'BreadCrumb',
    computed: {
      breadList () {
        // matched 是路由的层级关系
        return this.$route.matched
      }
    }
  }
</script>
