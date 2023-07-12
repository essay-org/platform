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
            columnName: 'applyType'
        },
        orderNo: {
            type: STRING,
            columnName: 'orderNo',
            defaultValue: ''
        },
        startTime: {
            type: DATE,
            columnName: 'startTime'
        },
        endTime: {
            type: DATE,
            columnName: 'endTime',
        },
        applyUser: {
            columnName: 'applyUser',
            type: JSON,
            defaultValue: '{"userId": "", "userName": "", "userEmail": ""}'
        },
        leaveTime: {
            columnName: 'leaveTime',
           type: STRING,
        },
        reasons: {
            type: STRING,
        },
        auditUsers: {
            type: STRING,
            columnName: 'auditUsers'

        },
        curAuditUserName: {
            columnName: 'curAuditUserName',
            type: STRING
        },
        auditFlows: {
            type: JSON,
            columnName: 'auditFlows',
            defaultValue: '{"userId": "", "userName": "", "userEmail": ""}'
        },
        auditLogs: {
            type: JSON,
            columnName: 'auditLogs',
            defaultValue: '{"userId": "", "userName": "", "userEmail": "", "createTime": "", "remark": "", "action": ""}'
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
    return Leave;
  };
  