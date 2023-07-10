<template>
  <!--
    外部 <FormItem v-bind="item" /> 会把 item 这个 JSON 配置项对象中的 label 透传给 el-form-item
    el-form-item 上的 prop 用于重置表单和规则校验，prop 可以像这样直接写，也可以配置在传递给 QueryForm 的 form 这个 JSON 对象中
  -->
  <el-form-item :prop="item.model">
    <!--
      v-bind="$attrs" 的 $attrs 是除去 props 和 emits 后外部透传过来的属性
      这里直接赋值给这些 element-plus 组件，是因为配置的 JSON 中有 model 和 placeholder 等属性
      这些属性可以通过 v-bind 直接透传给 element-plus 组件
      另外这些 element-plus 组件可以用 component 组件配合 is 属性来使用，扩展性更好
    -->
    <el-input v-if="item.type === 'input'" v-bind="$attrs" />
    <el-select v-else-if="item.type === 'select'" v-bind="$attrs">
      <!--
        v-bind="option" 相当于把 option 中的属性都绑定到 el-option 中
        如 :label="option.label" :value="option.value"
      -->
      <el-option v-for="option in item.options" :key="option.value" v-bind="option" />
    </el-select>
  </el-form-item>
</template>

<script>
  export default {
    name: 'FormItem',
    /**
     * element-plus 的组件用 v-bind="$attrs" 接收了不在 props 定义的属性
     * 其中 <FormItem v-model /> v-model 的 modelValue 也需要传给 element-plus 组件
     * 所以就不能在 props 中定义 modelValue
     */
    props: ['item']
  }
</script>
