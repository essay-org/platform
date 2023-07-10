<template>
  <div class="menu-manager">
    <div class="query-form">
      <QueryForm :form="form" v-model="queryForm" @handleQuery="getMenuList" />
      <!-- <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState" placeholder="请选择菜单状态">
            <el-option :value="1" label="正常" />
            <el-option :value="2" label="停用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)" v-has="'menu-create'">创建</el-button>
      </div>
      <!-- 
        树形结构必须要定义 row-key
        tree-props 定义树形数据中子项的属性名称，这里我们返回的数据已经是 children 了，可以不用写，这里是为了演示
       -->
      <el-table :data="menuList" row-key="_id" :tree-props="{children: 'children'}">
        <el-table-column
          v-for="item in columns" :key="item.prop"
          :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter"
        />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" @click="handleAdd(2, scope.row)" size="small" v-has="'menu-create'">新增</el-button>
            <el-button type="success" @click="handleEdit(scope.row)" size="small" v-has="'menu-edit'">编辑</el-button>
            <el-button type="danger" @click="handleDel(scope.row._id)" size="small" v-has="'menu-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="action == 'add' ? '菜单新增' : (action == 'edit' ? '菜单编辑' : '菜单删除')" v-model="showModal">
      <el-form ref="dialogForm" :model="menuForm" label-width="100px" :rules="rules">
        <el-form-item label="菜单类型" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId" placeholder="请选择父级菜单"
            :options="menuList" clearable
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            style="width: 100%"
          />
          <span>不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuForm.menuType == 1 ? '菜单名称' : '按钮名称'" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType == 1">
          <!-- 可以把输入框换成下拉框，提供图标供选择 -->
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType == 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType == 2">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType == 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType == 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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

  const columns = [{
    label: '菜单名称',
    prop: 'menuName',
    width: 180
  }, {
    label: '图标',
    prop: 'icon'
  }, {
    label: '菜单类型',
    prop: 'menuType',
    formatter (row, column, value) {
      return {
        1: '菜单',
        2: '按钮'
      }[value]
    }
  }, {
    label: '权限标识',
    prop: 'menuCode'
  }, {
    label: '路由地址',
    prop: 'path'
  }, {
    label: '组件路径',
    prop: 'component'
  }, {
    label: '菜单状态',
    prop: 'menuState',
    width: 90,
    formatter (row, column, value) {
      return {
        1: '正常',
        2: '停用'
      }[value]
    }
  }, {
    label: '创建时间',
    prop: 'createTime',
    width: 150,
    formatter (row, column, value) {
      return util.formateDate(new Date(value))
    }
  }]

  export default {
    name: 'Menu',
    data () {
      return {
        queryForm: {
          menuState: 1
        },
        menuList: [],
        columns,
        showModal: false,
        menuForm: {
          parentId: [ null ],
          menuType: 1,
          menuState: 1
        },
        action: '',  // add 创建，edit 编辑，delete 删除
        rules: {
          menuName: [{
            required: true, message: '请输入菜单名称', trigger: 'blur'
          }, {
            min: 2, max: 8, message: '菜单名称请限制在2-8个字符', trigger: 'blur'
          }]
        },
        form: [{
          type: 'input',
          label: '菜单名称',
          model: 'menuName',
          placeholder: '请输入菜单名称'
        }, {
          type: 'select',
          label: '菜单状态',
          model: 'menuState',
          placeholder: '请选择菜单状态',
          options: [{
            label: '正常',
            value: 1
          }, {
            label: '停用',
            value: 2
          }]
        }]
      }
    },
    mounted () {
      this.getMenuList()
    },
    methods: {
      async getMenuList () {
        try {
          this.menuList = await this.$api.getMenuList(this.queryForm)
        } catch (error) {
          throw new Error(error)
        }
      },
      // 重置表单
      handleReset (form) {
        this.$refs[form].resetFields()
      },
      // 新增菜单
      handleAdd (type, row) {
        this.showModal = true
        this.action = 'add'
        /**
         * 点击列表项的新增，会给父级菜单一个初始值
         * filter 过滤是因为第一层的 parentId 为 null
         */
        if (type == 2) {
          this.$nextTick(() => {
            // 让菜单渲染后再赋值，有利于表单重置
            this.menuForm.parentId = [...row.parentId, row._id].filter(item => item)
          })
        }
      },
      handleEdit (row) {
        this.showModal = true
        this.action = 'edit'
        this.$nextTick(() => {  // 弹框渲染后再赋值，有利于表单重置
          // 不能直接赋值，因为 row 也是响应式的，如果此时重置表单会将 row 数据也重置掉
          // this.menuForm = row
          // 需要用 Object.assign 浅拷贝一份
          Object.assign(this.menuForm, row)
        })
      },
      async handleDel (_id) {
        /**
         * 这里不需要判断返回值，也不需要用 try-catch 包裹
         * 因为在我们封装的 request 中，只有接口状态码为 200 才会正常返回数据
         * 接口状态码不是 200 的都会提示错误，然后返回一个 Promise.reject
         * 而 await 接收到 Promise.reject 就会抛出错误，不会继续走下去了
         * 以往我们用 try-catch 捕获错误就是为了提示用户，但在 request 中已经提示过了，所以这里不用再捕获然后提示了
         * 当然你也可以捕获错误然后什么都不做，让代码更加健壮
         */
        try {
          await this.$api.menuSubmit({ _id, action: 'delete' })
          this.$message.success('删除成功')
          this.getMenuList()
        } catch (err) { /* 封装的 request 中已经提示过错误了 */ }
      },
      // 弹框关闭
      handleClose () {
        this.showModal = false
        this.handleReset('dialogForm')
      },
      // 菜单新增或编辑提交
      handleSubmit () {
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            const { menuForm, action } = this
            const params = { ...menuForm, action }
            try {
              await this.$api.menuSubmit(params)
              this.showModal = false
              this.$message.success('操作成功')
              this.handleReset('dialogForm')
              this.getMenuList()
            } catch (error) {
              this.$message.error(`操作失败：${error}`)
            }
          }
        })
      }
    }
  }
</script>
