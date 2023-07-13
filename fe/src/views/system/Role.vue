<template>
  <div class="role-manager">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd" v-has="'role-create'">创建</el-button>
      </div>
      <el-table :data="roleList" v-if="!loading">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" v-has="'role-edit'">编辑</el-button>
            <el-button type="primary" size="small" @click="handleOpenPermission(scope.row)"
              v-has="'role-setting'">设置权限</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row.id)" v-has="'role-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
        :page-size="pager.pageSize" @update:page-size="handleCurrentChange" />
    </div>
    <!-- 角色操作弹框 -->
    <el-dialog title="角色新增" v-model="showModal">
      <el-form ref="dialogForm" :model="roleForm" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="roleForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限弹框 -->
    <el-dialog title="权限设置" v-model="showPermission">
      <el-form label-width="100px">
        <el-form-item label="角色名称">{{ curRoleName }}</el-form-item>
        <el-form-item label="选择权限">
          <!-- 
            show-checkbox 节点是否可被选择
            node-key 用于设置和获取选中节点
            default-expand-all 默认展开全部子节点
           -->
          <el-tree ref="tree" :data="menuList" default-expand-all show-checkbox node-key="id"
            :props="{ label: 'menuName' }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'

const columns = [{
  label: '角色名称',
  prop: 'roleName'
}, {
  label: '备注',
  prop: 'remark'
}, {
  label: '权限列表',
  prop: 'permissionList',
  formatter: (row, column, value) => {
    const list = value.halfCheckedKeys || [], names = []
    list.map(key => {
      if (key) names.push(actionMap[key])
    })
    return names.filter(item => item).join('，')
  }
}, {
  label: '创建时间',
  prop: 'createdAt',
  formatter(row, column, value) {
    return util.formateDate(value)
  }
}, {
  label: '更新时间',
  prop: 'updatedAt',
  formatter(row, column, value) {
    return util.formateDate(value)
  }
}]
const actionMap = {}

export default {
  name: 'Role',
  data() {
    return {
      loading: false,
      queryForm: {},
      roleList: [],
      columns,
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      action: 'add',
      showModal: false,
      roleForm: {},
      rules: {
        roleName: [{
          required: true, message: '请输入角色名称', trigger: 'blur'
        }]
      },
      showPermission: false,
      curRoleId: '',
      curRoleName: '',
      menuList: [],
      actionMap: {}
    }
  },
  async mounted() {
    this.loading = true
    await this.getRoleList()
    await this.getMenuList()
    this.loading = false
  },
  methods: {
    async getRoleList() {
      try {
        const { list, page } = await this.$api.getRoleList(this.queryForm)
        this.roleList = list
        this.pager.total = page.total
      } catch (error) {
        throw new Error(error)
      }
    },
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    // 角色新增弹出弹框
    handleAdd() {
      this.action = 'add'
      this.showModal = true
    },
    // 角色编辑
    handleEdit(row) {
      this.action = 'edit'
      this.showModal = true
      this.$nextTick(() => {  // nextTick 让数据在渲染后再赋值，保证表单初始状态为空
        // 用 Object.assign 而不是直接赋值，是因为 row 也是响应式的，如果表单重置 row 这行数据也会清空
        Object.assign(this.roleForm, row)
      })
    },
    // 角色删除
    async handleDel(id) {
      try {
        await this.$api.roleSubmit({ id, action: 'delete' })
        this.$message.success('删除成功')
        this.getRoleList()
      } catch (error) {
        this.$message.error(`删除失败：${error}`)
      }
    },
    // 弹框关闭
    handleClose() {
      this.handleReset('dialogForm')
      // 角色编辑时会将一整行数据都复制给 roleForm，其中有不需要的字段在清除表单时仍会保留，所以这里将其置为空对象
      this.roleForm = {}
      this.showModal = false
    },
    // 角色提交
    handleSubmit() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          try {
            const { roleForm, action } = this
            const params = { ...roleForm, action }
            const res = await this.$api.roleSubmit(params)
            if (res) {
              this.showModal = false
              this.$message.success('角色操作成功')
              this.handleReset('dialogForm')
              // 角色编辑时会将一整行数据都复制给 roleForm，其中有不需要的字段在清除表单时仍会保留，所以这里将其置为空对象
              this.roleForm = {}
              this.getRoleList()
            } else {
              this.$message.error('角色操作失败')
            }
          } catch (error) {
            this.$message.error(`角色操作失败：${error}`)
          }
        }
      })
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current
      this.getRoleList()
    },
    async getMenuList() {
      try {
        this.menuList = await this.$api.getMenuList()
        this.getActionMap(this.menuList)
      } catch (error) {
        throw new Error(error)
      }
    },
    handleOpenPermission(row) {
      this.showPermission = true
      this.curRoleId = row.id
      this.curRoleName = row.roleName
      const { checkedKeys } = row.permissionList
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(checkedKeys)
      })
    },
    async handlePermissionSubmit() {
      const nodes = this.$refs.tree.getCheckedNodes()
      const halfKeys = this.$refs.tree.getHalfCheckedKeys()
      const checkedKeys = [], parentKeys = []
      // 区分菜单和按钮，checkedKeys 中都是按钮，parentKeys 中都是菜单
      nodes.map(node => {
        if (!node.children) checkedKeys.push(node.id)
        else parentKeys.push(node.id)
      })
      const params = {
        id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys)
        }
      }
      await this.$api.updatePermission(params)
      this.showPermission = false
      this.$message.success('设置成功')
      this.getRoleList()
    },
    getActionMap(list) {
      const deep = arr => {
        while (arr.length) {
          const item = arr.pop()
          if (item.children && item.action) {  // 按钮的上一级菜单
            actionMap[item.id] = item.menuName
          }
          if (item.children && !item.action) {  // 一级菜单，子数组不是按钮的
            deep(item.children.slice())
          }
        }
      }
      deep(list.slice())
    }
  }
}
</script>

<style lang='less'>
.role-manager {
  .base-table {
    .pagination {
      padding: 20px 10px;
      display: flex;
      justify-content: center; // 设置分页器居中
    }
  }
}
</style>
