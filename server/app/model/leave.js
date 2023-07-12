module.exports = function (app) {
    const {
      Bone,
      DataTypes: { STRING,BOOLEAN, DATE, JSON, BIGINT},
    } = app.model;
    class Leave extends Bone {
      static table = 'leave';
      static attributes = {
        id: {
          type: STRING,
          primaryKey: true,
        },
        applyType: {
            type: BIGINT,
        },
        orderNo: {
            type: STRING,
            defaultValue: ''
        },
        startTime: {
            type: DATE,
        },
        endTime: {
            type: DATE,
        },
        // {"userId": "", "userName": "", "userEmail": ""}
        applyUser: {
            type: JSON,
        },
        leaveTime: {
           type: STRING,
        },
        reasons: {
            type: STRING,
        },
        auditUsers: {
            type: STRING,

        },
        curAuditUserName: {
            type: STRING
        },
        // {"userId": "", "userName": "", "userEmail": ""}
        auditFlows: {
            type: JSON,
        },
        // {"userId": "", "userName": "", "userEmail": "", "createTime": "", "remark": "", "action": ""}
        auditLogs: {
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
    return Leave;
  };
  