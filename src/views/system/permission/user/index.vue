<template>
  <div class="card">
    <div class="left">
      <a-tree
        v-model:expandedKeys="state.expandedKeys"
        auto-expand-parent
        :tree-data="state.deptTree"
        @select="onTreeSelect"
      >
        <template #title="{ key, title, formData }">
          <a-dropdown :trigger="['contextmenu']">
            <span>{{ title }}</span>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  key="1"
                  :disabled="!$auth('sys.dept.update')"
                  @click="openDeptModal(formData)"
                >
                  编辑 <EditOutlined></EditOutlined>
                </a-menu-item>
                <a-menu-item
                  key="2"
                  :disabled="!auth('sys.dept.delete')"
                  @click="delDept(key)"
                >
                  删除 <DeleteOutlined></DeleteOutlined>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </div>

    <div class="right">
      <dynamic-table
        header-title="用户管理"
        show-index
        title-tooltip="请不要随意删除用户，避免到影响其他用户的使用"
        :data-request="loadTableData"
        :columns="columns"
        :scroll="{ x: 2000 }"
        :row-selection="rowSelection"
      >
        <template #toolbar>
           <a-button type="primary" :disabled="!$auth('sys.user.add')" @click="openUserModal({})">
            <PlusOutlined /> 新增
          </a-button>
        </template>
      </dynamic-table>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import { deptSchemas } from "./formSchemas";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { useFormModal } from '@/hooks/useModal/index'
const [showModal] = useFormModal()
const [DynamicTable, dynamicTableInstance ] = useTable()

export default defineComponent({
  setup() {
    const openDeptModal = async (record) => {
      const [formRef] = await showModal({
        modalProps: {
          title: record.id ? "编辑部门" : "新增部门",
          width: 700,
          onFinish: async (values) => {
            values.id = record.id;
            await (record.id ? updateDept : createDept)(values);
            fetchDeptList();
          },
        },
        formProps: {
          labelWidth: 100,
          schemas: deptSchemas,
        },
      });
    };

    const delDept = () => {};

    return {
      openDeptModal
    };
  },
});
</script>

<style lang="less" scoped>
</style>
