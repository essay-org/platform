import { getRoleList } from '@/api/system/role'

export const deptSchemas = [
  {
    field: 'name',
    component: 'Input',
    label: '部门名称',
    rules: [{required: true, type: 'string'}]
  },
  {
    field: 'parentId',
    component: 'TreeSelect',
    label: '上级部门',
    componentProps: {
      getPopupContainer: () => document.body
    },
    rules: [{required: true, type: 'number'}],
  },
  {
    field: 'orderNum',
    component: 'InputNumber',
    label: '排序号',
    defaultValue: 255,
    componentProps: {
      style: {
        width: '100%'
      }
    },
  }
]


export const userSchemas = [
  {
    field: 'departmentId',
    component: 'TreeSelect',
    label: '所属部门',
    componentProps: {
      getPopupContainer: () => document.body,
    },
    rules: [{ required: true, type: 'number' }],
  },
  {
    field: 'roles',
    component: 'Select',
    label: '所属角色',
    rules: [{ required: true, type: 'array' }],
    componentProps: {
      mode: 'multiple',
      request: async () => {
        const data = await getRoleList();
        return data.map((n) => ({ label: n.name, value: n.id }));
      },
    },
  },
  {
    field: 'username',
    component: 'Input',
    label: '用户名',
    rules: [{ required: true }],
  },{
    field: 'name',
    component: 'Input',
    label: '姓名',
    colProps: {
      span: 12,
    },
    rules: [{ required: true }],
  }, {
    field: 'nickName',
    component: 'Input',
    label: '呢称',
    colProps: {
      span: 12,
    },
  },{
    field: 'phone',
    component: 'Input',
    label: '手机',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '备注',
  },
  {
    field: 'status',
    component: 'RadioGroup',
    label: '状态',
    defaultValue: 1,
    componentProps: {
      options: [
        {
          label: '启用',
          value: 1,
        },
        {
          label: '禁用',
          value: 0,
        },
      ],
    },
  },
]

export const updatePswSchemas = [
  {
    field: 'password',
    component: 'Input',
    label: '新密码',
    rules: [{required: true, type: 'string'}],
  },
]
