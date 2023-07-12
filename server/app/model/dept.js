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
        },
        userId: {
           type: STRING,
        },
        userName: {
          type: STRING,
        },
        userEmail: {
          type: STRING,
        },
        // []
        parentId: {
          type: JSON,
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
    return Dept;
  };
  