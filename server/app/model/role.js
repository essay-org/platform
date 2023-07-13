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
        // defaultValue: {}
      },
      
      updatedAt: {
        type: DATE,
      },
      createdAt: {
        type: DATE,
      },
      deleteAt: {
        type: DATE,
      },
    };
  }
  return Role;
};
