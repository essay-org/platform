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
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

export default defineComponent({
  setup() {
    const openDeptModal = () => {

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
