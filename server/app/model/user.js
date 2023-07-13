module.exports = function (app) {
  const {
    Bone,
    DataTypes: { STRING, DATE, BIGINT, JSON},
  } = app.model;
  class User extends Bone {
    static table = 'user';
    static primaryKey = 'userId'
    static attributes = {
      userId: {
        type: STRING,
        primaryKey: true,
      },
      userName: {
        type: STRING,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      userPwd: {
        type: STRING,
      },
      userEmail: {
        type: STRING,
        unique: true,
        validate: {
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
        type: JSON,
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
        type: JSON,
      },
      remark: {
        type: STRING,
        defaultValue: ''
      },
      lastLoginTime: {
        type: DATE,
        defaultValue: new Date()
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
  return User;
};
