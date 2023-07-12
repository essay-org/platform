module.exports = function (app) {
  const {
    Bone,
    DataTypes: { STRING,BOOLEAN, DATE, JSON, BIGINT},
  } = app.model;
  class Role extends Bone {
    static table = 'role';
    static attributes = {
      id: {
        type: STRING,
        primaryKey: true,
      },
      roleName: {
        type: STRING,
        columnName: 'roleName',
        validate: {
          notEmpty: true,
          notNull: true
        },
      },
      remark: {
        type: STRING,
        defaultValue: ''
      },
      // {checkedKeys: [], halfCheckedKeys: []}
      permissionList: {
        type: JSON,
        columnName: 'permissionList',
        defaultValue: '',
      },
      
      updatedAt: {
        type: DATE,
        columnName: 'updatedAt',
      },
      createdAt: {
        type: DATE,
        columnName: 'createdAt'
      },
      deleteAt: {
        type: DATE,
        columnName: 'deleteAt'
      },
    };
  }
  return Role;
};
