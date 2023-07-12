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
        applyUser: {
            type: JSON,
            defaultValue: '{"userId": "", "userName": "", "userEmail": ""}'
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
        auditFlows: {
            type: JSON,
            defaultValue: '{"userId": "", "userName": "", "userEmail": ""}'
        },
        auditLogs: {
            type: JSON,
            defaultValue: '{"userId": "", "userName": "", "userEmail": "", "createTime": "", "remark": "", "action": ""}'
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
  