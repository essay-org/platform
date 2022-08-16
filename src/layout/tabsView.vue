<template>
  <div>
    <router-view v-slot="{ Component }">
      <template v-if="Component">

      <component :is="Component"></component>
            </template>

    </router-view>
  </div>
</template>

<script>
export default {
  setup () {


    return {}
  }
}
</script>

<style lang="less" scoped>

</style>
