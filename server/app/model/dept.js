module.exports = function (app) {
    const {
      Bone,
      DataTypes: { STRING,BOOLEAN, DATE, JSON, BIGINT},
    } = app.model;
    class Dept extends Bone {
      static table = 'dept';
      static attributes = {
        id: {
          type: STRING,
          primaryKey: true,
        },
        deptName: {
            type: STRING,
            columnName: 'deptName'
        },
        userId: {
           type: STRING,
           columnName: 'userId',
        },
        userName: {
          type: STRING,
          columnName: 'userName',
        },
        userEmail: {
          type: STRING,
          columnName: 'userEmail'
        },
        // []
        parentId: {
          type: STRING,
          columnName: 'parentId'
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
    return Dept;
  };
  