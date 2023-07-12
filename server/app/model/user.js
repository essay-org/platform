module.exports = function (app) {
  const {
    Bone,
    DataTypes: { STRING, DATE, BIGINT},
  } = app.model;
  class User extends Bone {
    static table = 'user';
    static primaryKey = 'userId'
    static attributes = {
      userId: {
        type: STRING,
        primaryKey: true,
        columnName: 'userId',
      },
      userName: {
        type: STRING,
        columnName: 'userName',
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      userPwd: {
        type: STRING,
        columnName: 'userPwd',
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      userEmail: {
        type: STRING,
        columnName: 'userEmail',
        validate: {
          unique: true,
          notNull: true,
          notEmpty: true,
        },
      },
      mobile: {
        type: STRING,
        defaultValue: ''
      },
      // 性别 0:男 1：女
      sex: {
        type: BIGINT,
        defaultValue: -1
      },
      // string array
      deptId: {
        type: STRING,
        columnName: 'deptId',
        defaultValue: ''
      },
      // 1: 在职 2: 离职 3: 试用期
      state: {
        type: BIGINT,
        defaultValue: 1
      },
      // 岗位
      job: {
        type: STRING,
        defaultValue: ''
      },
      //  用户角色 0：系统管理员 1： 普通用户
      role: {
        type: BIGINT,
        defaultValue: 1
      },
      // 系统角色 string array
      roleList: {
        type: STRING,
        columnName: 'roleList',
        defaultValue: ''
      },
      remark: {
        type: STRING,
        defaultValue: ''
      },
      lastLoginTime: {
        type: DATE,
        columnName: 'lastLoginTime',
        defaultValue: new Date()
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
  return User;
};
