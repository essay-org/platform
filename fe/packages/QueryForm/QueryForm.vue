<template>
  <el-form ref="queryForm" inline :model="queryModel">
    <template v-for="(item, index) in form" :key="item.model">
      <!-- v-bind="item" 会把 item 对象的所有属性绑定到 FormItem 内根元素上，如 :label="item.label" -->
      <FormItem :item="item" v-bind="item" v-model="queryModel[item.model]" />
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue'
  import FormItem from './FormItem.vue'

  export default {
    name: 'QueryForm',
    /**
     * form 是一个 JSON 对象
     * modelValue 是 v-model 的默认值，即 v-model:modelValue
     * v-model 本质是 modelValue 和 @update:modelValue 的语法糖
     */
    props: ['form', 'modelValue'],
    emits: ['update:modelValue'],
    components: { FormItem },
    setup (props, context) {
      const { ctx } = getCurrentInstance()
      const queryModel = reactive({
        ...props.modelValue
      })
      const { form } = props

      const handleQuery = () => {
        // 触发的 update:modelValue 会把值传递给 <QueryForm v-model="user" /> 中 v-model 绑定的 user 对象
        context.emit('update:modelValue', { ...queryModel })
        context.emit('handleQuery')  // handleQuery 要放后面，这样 v-model 的值改变后再重新查询
      }
      const handleReset = () => {
        ctx.$refs.queryForm.resetFields()
      }

      return {
        queryModel,
        form,
        handleQuery,
        handleReset
      }
    }
  }
</script>
