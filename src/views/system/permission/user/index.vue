<template>
  <div class="card">
    {{ state.deptTree }}
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

    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "@vue/runtime-core";
import { createDept, deleteDept, updateDept, getDeptList, transferDept } from '@/api/system/dept';

// import { deptSchemas } from "./formSchemas";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { formatDept2Tree, findChildById } from '@/utils/index';

// import { Modal } from "ant-design-vue";
// import { useFormModal } from '@/hooks/useModal/index'

// const [showModal] = useFormModal()

// const [DynamicTable, dynamicTableInstance ] = useTable()

export default defineComponent({
  components: {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
  },
  setup() {
    const openDeptModal = async (record) => {
      // const [formRef] = await showModal({
      //   modalProps: {
      //     title: record.id ? "编辑部门" : "新增部门",
      //     width: 700,
      //     onFinish: async (values) => {
      //       values.id = record.id;
      //       await (record.id ? updateDept : createDept)(values);
      //       fetchDeptList();
      //     },
      //   },
      //   formProps: {
      //     labelWidth: 100,
      //     schemas: deptSchemas,
      //   },
      // });
    };

    const delDept = () => {};

    const state = reactive({
      expandedKeys: [],
      departmentIds: [],
      deptTree: [],
    })

    const deptListLoading = ref(false);

    const fetchDeptList = async () => {
      deptListLoading.value = true
      const dept = await getDeptList().finally(() => (deptListLoading.value = false))
      // debugger
      state.deptTree = formatDept2Tree(dept); // TODO: formDept2Tree
      console.log(state.deptTree, dept)
      state.expandedKeys = [...state.expandedKeys, ...state.deptTree.map(n => Number(n.key))]
    }

    fetchDeptList()

    const onTreeSelect = () => {

    }
    return {
      state,
      openDeptModal,
      onTreeSelect
    };
  },
});
</script>

<style lang="less" scoped>
</style>
