<template>
  <div class="user-manager">
    <div class="query-form">
      <QueryForm :form="form" v-model="user" @handleQuery="handleQuery" />
    </div>
    <!-- <div class="base-table">
      注释：base-table 和 action 在 @/assets/style/index.less 中设置了部分样式，主要是一些间距和边框
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'user-create'">新增</el-button>
        <el-button type="danger" @click="handlePatchDel" v-has="'user-patch-delete'">批量删除</el-button>
      </div>
      注释：selection-change 在选中多选框时触发
      <el-table :data="userList" @selection-change="handleSelectionChange">
        注释：type="selection" 是复选框
        <el-table-column type="selection" width="55"></el-table-column>
        注释：prop 对应传入 el-table 的 data 数据中的属性；formatter 用于格式化显示的数据
        <el-table-column
          v-for="item in columns" :key="item.prop"
          :prop="item.prop" :label="item.label" :width="item.width" :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          注释：插槽的作用域 scope 中存放着当前行的数据
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" v-has="'user-edit'">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)" v-has="'user-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      注释：background 为页码加上色块，layout 配置布局；total 总条数，page-size 每页条数
      <el-pagination
        class="pagination" background layout="prev, pager, next"
        :total="pager.total" :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div> -->
    <BaseTable :columns="columns" :data="userList" selection :pager="pager" @selection-change="handleSelectionChange"
      @handleAction="handleAction" @handleCurrentChange="handleCurrentChange">
      <template #action>
        <el-button type="primary" @click="handleCreate" v-has="'user-create'">新增</el-button>
        <el-button type="danger" @click="handlePatchDel" v-has="'user-patch-delete'">批量删除</el-button>
      </template>
    </BaseTable>
    <el-dialog :title="action == 'add' ? '用户新增' : '用户编辑'" v-model="showModal">
      <!-- label-width 可以统一指定 el-form-item 的 label 宽度，让 label 对齐的同时防止 el-input 占据一整行 -->
      <el-form ref="dialogForm" :model="userForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名称" :disabled="action === 'edit'" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" placeholder="请输入用户邮箱" :disabled="action === 'edit'">
            <!-- input 框后缀 -->
            <template #append>@imooc.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入用户手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入用户岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state" placeholder="请选择用户状态">
            <el-option :value="1" label="在职" />
            <el-option :value="2" label="离职" />
            <el-option :value="3" label="试用期" />
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <!-- multiple 开启下拉框多选，style="width: 100%" 让下拉框撑开到弹框宽度 -->
          <el-select v-model="userForm.roleList" placeholder="请选择用户的系统角色" multiple style="width: 100%">
            <el-option v-for="role in roleList" :key="role._id" :value="role._id" :label="role.roleName" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <!--
            options 是渲染的数据源
            props 中的 checkStrictly 指定父子节点不关联，可以单选
            props 中的 value 和 label 指定数据源中的属性
            clearable 支持清空选项
          -->
          <el-cascader v-model="userForm.deptId" placeholder="请选择用户所属的部门" :options="deptList" style="width: 100%"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable />
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
import { getCurrentInstance, nextTick, onMounted, reactive, ref, toRaw } from 'vue'
import util from '@/utils/util'

export default {
  name: 'UserPage',
  setup() {
    /**
     * Composition API 写法，setup 中没有 this，需要通过 getCurrentInstance 方法获取上下文 ctx
     * appContext 可以拿到在 main.js 中配置的全局配置 $api、$storage 等
     */
    const { ctx, appContext } = getCurrentInstance()
    const { $api, $message } = appContext.config.globalProperties

    const user = ref({
      // 用户表单对象
      state: 0 // 默认状态为所有
    })
    // 弄个假数据测试页面结构
    const userList = ref([]) // 用户列表
    const columns = [
      {
        label: '用户 ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'userName'
      },
      {
        label: '用户邮箱',
        prop: 'userEmail'
      },
      {
        label: '用户角色',
        prop: 'role',
        // formatter 是 el-table 提供的用于格式化的方法，row 是所在行数据，column 是所在列数据，value 是绑定的值
        formatter(row, column, value) {
          return {
            0: '管理员',
            1: '普通用户'
          }[value]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter(row, column, value) {
          return {
            1: '在职',
            2: '离职',
            3: '试用期'
          }[value]
        }
      },
      {
        label: '注册时间',
        prop: 'createTime',
        width: 180,
        formatter: (row, column, value) => {
          return util.formateDate(new Date(value))
        }
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        width: 180,
        formatter: (row, column, value) => {
          return util.formateDate(new Date(value))
        }
      },
      {
        type: 'action',
        label: '操作',
        width: 150,
        list: [
          {
            type: 'primary',
            text: '编辑'
          },
          {
            type: 'danger',
            text: '删除'
          }
        ]
      }
    ]
    const pager = reactive({
      // 分页对象
      pageNum: 1,
      pageSize: 10
    })
    let checkedUserIds = [] // 每选中一个用户就将其 id 存入该数组中
    const showModal = ref(false) // 弹框显示布尔值
    const userForm = reactive({
      // 用户新增表单对象
      state: 3 // 状态默认为试用期
    })
    const rules = {
      // 定义用户新增表单校验规则
      userName: [
        {
          required: true,
          message: '请输入用户名称',
          trigger: 'blur'
        }
      ],
      userEmail: [
        {
          required: true,
          message: '请输入用户邮箱',
          trigger: 'blur'
        }
      ],
      mobile: [
        {
          pattern: /1\d{10}/,
          message: '请输入正确的手机号格式',
          trigger: 'blur'
        }
      ],
      deptId: [
        {
          required: true,
          message: '请选择用户所属的部门',
          trigger: 'blur'
        }
      ]
    }
    const action = ref('add') // 定义用户操作行为，add 新增，edit 编辑
    const roleList = ref([]) // 系统角色列表
    const deptList = ref([]) // 部门列表

    const form = [
      {
        type: 'input',
        label: '用户ID',
        model: 'userId',
        placeholder: '请输入用户ID'
      },
      {
        type: 'input',
        label: '用户名称',
        model: 'userName',
        placeholder: '请输入用户名称'
      },
      {
        type: 'select',
        label: '状态',
        model: 'state',
        placeholder: '请选择状态',
        options: [
          {
            label: '所有',
            value: 0
          },
          {
            label: '在职',
            value: 1
          },
          {
            label: '离职',
            value: 2
          },
          {
            label: '试用期',
            value: 3
          }
        ]
      }
    ]

    onMounted(() => {
      getUserList()
      // 担心性能问题可以在弹框打开时再请求，但一般后台项目不用担心性能问题，所以就在这里直接请求
      getRoleAllList()
      getDeptList()
    })

    // 获取用户列表
    const getUserList = async () => {
      const params = { ...user.value, ...pager }
      try {
        const { page, list } = await $api.getUserList(params)
        userList.value = list
        pager.total = page.total
      } catch (error) {
        console.error(error)
      }
    }

    // 根据条件查询用户列表
    const handleQuery = () => {
      getUserList()
    }
    // 重置查询表单
    const handleReset = (form) => {
      ctx.$refs[form].resetFields()
    }

    // 分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }

    // 用户单个删除
    const handleDel = async (row) => {
      try {
        const res = await $api.userDel({
          userIds: [row.userId]
        })
        if (res.modifiedCount > 0) {
          $message.success('删除成功')
          getUserList()
        } else {
          $message.error('删除失败')
        }
      } catch (err) {
        $message.error('删除失败 ', err)
      }
    }
    // 用户批量删除
    const handlePatchDel = async () => {
      if (checkedUserIds.length === 0) {
        $message.error('请选择要删除的用户')
        return
      }
      try {
        const res = await $api.userDel({
          userIds: checkedUserIds
        })
        if (res.modifiedCount > 0) {
          $message.success('删除成功')
          getUserList()
        } else {
          $message.error('删除失败')
        }
      } catch (err) {
        $message.error('删除失败 ', err)
      }
    }

    // 表格选中多选框
    const handleSelectionChange = (list) => {
      const arr = []
      list.map((item) => {
        arr.push(item.userId)
      })
      checkedUserIds = arr
    }

    // 用户新增
    const handleCreate = () => {
      action.value = 'add'
      showModal.value = true
    }

    // 获取系统角色名称列表
    const getRoleAllList = async () => {
      try {
        roleList.value = await $api.getRoleAllList()
      } catch (err) {
        $message.error('获取系统角色列表失败 ', err)
      }
    }
    // 获取部门列表
    const getDeptList = async () => {
      try {
        deptList.value = await $api.getDeptList()
      } catch (err) {
        $message.error('获取部门列表失败 ', err)
      }
    }

    // 用户新增弹框取消关闭方法
    const handleClose = () => {
      showModal.value = false
      handleReset('dialogForm')
    }
    // 用户新增弹框确定提交方法
    const handleSubmit = () => {
      ctx.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          // 校验通过
          // 参数不需要响应式，toRaw 转化为普通对象即可
          const params = toRaw(userForm)
          params.userEmail += '@imooc.com'
          params.action = action.value
          try {
            const res = await $api.userSubmit(params)
            if (res) {
              showModal.value = false
              $message.success('用户操作成功')
              handleReset('dialogForm')
              getUserList()
            } else {
              $message.error('用户操作失败')
            }
          } catch (err) {
            $message.error('用户操作失败 ', err)
          }
        }
        // 校验没有通过会提示
      })
    }

    // 用户编辑
    const handleEdit = (row) => {
      action.value = 'edit'
      showModal.value = true
      /**
       * 等弹框渲染出来后再填充数据，否则点击取消按钮时会重置不了表单
       * 因为表单重置是重置到初始状态，这里如果不用 nextTick 那么表单初始状态就是有值的
       */
      nextTick(() => {
        Object.assign(userForm, row) // 将 row 中的数据复制到 userForm 中
        userForm.userEmail = userForm.userEmail.split('@')[0] // 填充文本时删掉 @imooc.com 后缀
      })
    }

    const handleAction = ({ index, row }) => {
      if (index == 0) handleEdit(row)
      else if (index == 1) handleDel(row)
    }

    return {
      user,
      userList,
      columns,
      pager,
      showModal,
      userForm,
      rules,
      roleList,
      deptList,
      action,
      form,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDel,
      handlePatchDel,
      handleSelectionChange,
      handleCreate,
      handleClose,
      handleSubmit,
      handleEdit,
      handleAction
    }
  }
}
</script>

<style lang="less">
.user-manager {
  .base-table {
    .pagination {
      padding: 20px 10px;
      display: flex;
      justify-content: center; // 设置分页器居中
    }
  }
}
</style>
