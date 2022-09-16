<template>
  <div class="card">
    <div class="left">
      <a-tree
        v-model:expandedKeys="state.expandedKeys"
        auto-expand-parent
        :tree-data="state.deptTree"
        @select="onTreeSelect"
      >
      <template #title="{key, title, formData}">
        <a-dropdown :trigger="['contextmenu']">
          <span>{{title}}</span>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" :disabled="!$auth('sys.dept.update')" @click="openDeptModal(formData)">
                编辑 <EditOutlined></EditOutlined>
              </a-menu-item>
                <a-menu-item key="2" :disabled="!auth('sys.dept.delete')" @click="delDept(key)">
                  删除 <DeleteOutlined></DeleteOutlined>
                </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      </a-tree>
    </div>

    <div class="right"></div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import { deptSchemas } from './'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

export default defineComponent({
  setup() {
    const openDeptModal = async (record) => {
      const [formRef] = await showModal({
        modalProps: {
          title: record.id ? '编辑部门' : '新增部门',
          width: 700,
          onFinish: async (values) => {
            values.id = record.id
            await (record.id ? updateDept : createDept)(values)
            fetchDeptList()
          }
        },
        formProps: {
          labelWidth: 100,
          schemas: deptSchemas
        }
      })
    }

    const delDept = () => {

    }

    return {

    }
  }
})
</script>

<style lang="less" scoped>
</style>
