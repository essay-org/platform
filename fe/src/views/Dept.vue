<template>
  <div class="dept-manager">
    <div class="query-form">
      <el-form ref="queryForm" :model="queryForm" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen" v-has="'dept-create'">创建</el-button>
      </div>
      <!-- stripe 斑马条纹 -->
      <el-table :data="deptList" row-key="_id" stripe>
        <!-- v-bind 会把 item 中的值绑定到 el-table-column 上，如 label、prop、width、formatter -->
        <el-table-column
          v-for="item in columns" :key="item.prop"
          v-bind="item"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)" v-has="'dept-edit'">编辑</el-button>
            <el-button size="small" @click="handleDel(scope.row._id)" v-has="'dept-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="action === 'add' ? '创建部门' : '编辑部门'" v-model="showModal">
      <el-form ref="dialogForm" :model="deptForm" :rules="rules" label-width="120px">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            placeholder="请选择上级部门" clearable
            v-model="deptForm.parentId" :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="deptForm.deptName" />
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select v-model="deptForm.user" placeholder="请选择部门负责人" @change="handleUser" style="width: 100%">
            <el-option
              v-for="item in userList" :key="item.userId"
              :label="item.userName" :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input v-model="deptForm.userEmail" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import util from '@/utils/util'

  export default {
    name: 'dept',
    data () {
      return {
        queryForm: {},
        columns: [{
          label: '部门名称',
          prop: 'deptName'
        }, {
          label: '负责人',
          prop: 'userName'
        }, {
          label: '创建时间',
          prop: 'createTime',
          formatter (row, column, value) {
            return util.formateDate(new Date(value))
          }
        }, {
          label: '更新时间',
          prop: 'updateTime',
          formatter (row, column, value) {
            return util.formateDate(new Date(value))
          }
        }],
        deptList: [],
        pager: {
          pageNum: 1,
          pageSize: 10
        },
        action: '',
        showModal: false,
        deptForm: {},
        rules: {
          parentId: [{ required: true, message: '请选择上级部门', trigger: 'blur' }],
          deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
          user: [{ required: true, message: '请选择负责人', trigger: 'blur' }]
        },
        userList: []
      }
    },
    mounted () {
      this.getDeptList()
      this.getUserList()
    },
    methods: {
      async getDeptList () {
        try {
          this.deptList = await this.$api.getDeptList(this.queryForm)
        } catch (error) {
          this.$message.error(`获取部门列表失败：${error}`)
        }
      },
      async getUserList () {
        try {
          this.userList = await this.$api.getAllUserList()
        } catch (error) {
          this.$message.error(`获取所有用户失败：${error.stack}`)
        }
      },
      handleReset (form) {
        this.$refs[form].resetFields()
      },
      handleOpen () {
        this.action = 'add'
        this.showModal = true
      },
      handleEdit (row) {
        this.action = 'edit'
        this.showModal = true
        this.$nextTick(() => {
          Object.assign(this.deptForm, row, {
            user: `${row.userId}/${row.userName}/${row.userEmail}`
          })
        })
      },
      async handleDel (_id) {
        try {
          await this.$api.deptSubmit({ _id, action: 'delete' })
          this.$message.success('部门删除成功')
          this.getDeptList()
        } catch (error) {
          this.$message.error(`部门删除失败：${error.stack}`)
        }
      },
      handleClose () {
        this.showModal = false
        this.handleReset('dialogForm')
      },
      handleSubmit () {
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            const params = { ...this.deptForm, action: this.action }
            delete params.user
            try {
              const res = await this.$api.deptSubmit(params)
              if (res) {
                this.handleClose()
                this.$message.success('部门操作成功')
                this.getDeptList()
              } else {
                this.$message.error('部门操作失败')
              }
            } catch (error) {
              this.$message.error(`部门操作失败：${error.stack}`)
            }
          }
        })
      },
      handleUser (val) {
        const [ userId, userName, userEmail ] = val.split('/')
        Object.assign(this.deptForm, { userId, userName, userEmail })
      }
    }
  }
</script>
