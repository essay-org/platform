'use strict';

const BaseController = require('../core/base');

class LeaveController extends BaseController {

  async list() {
    // { roleName }
    const data = this.ctx.state.user;
    const { applyState, type, pageNum, pageSize } = this.ctx.request.query;
    const { leave } = this.ctx.service;
    let params = {};
    if (type === 'approve') { // 查询用户待审批列表
      // 查询待审核的单子时，当前审批负责人是用户自己
      if (applyState === 1 || applyState === 2) { // 查询待审核以及审核中状态时当前审批人是自己
        params.curAuditUserName = data.userName;
        params.applyState = { $in: [ 1, 2 ] };
      } else if (applyState > 2) { // 查询审核通过、审核拒绝、作废
        params = {
          auditFlows: {
            userId: data.userId,
          },
          applyState,
        };
      } else { // 查询全部
        params.auditFlows = { userId: data.userId };
      }
    } else {
      // 查询用户个人申请列表
      // 查询是否有某条文档的 applyUser 对象下的 userId 值与 data.userId 相同
      params.applyUser = { userId: data.userId };
      if (applyState) params.applyState = applyState;
    }
    // console.log({ ...params, pageNum, pageSize });

    const result = await leave.find({ ...params, pageNum, pageSize });
    this.success(result);
  }

  async save() {
    const data = this.ctx.state.user;
    const { id, action, ...params } = this.ctx.request.body;
    const { leave, dept: deptServe } = this.ctx.service;
    if (action === 'add') {
      // 生成申请单号
      let orderNo = 'XJ';
      orderNo += this.ctx.helper.formateDate(new Date(), 'yyyy-MM-dd');
      const total = await leave.findCount();
      params.orderNo = orderNo + total; // 公司内部使用，所以编号可以不用那么严谨

      // 获取用户当前部门 ID
      const id = data.deptId.pop();
      // 查找当前部门信息，内含负责人信息
      const dept = await deptServe.findOne({ id });
      // 获取人事部门和财务部门负责人信息
      const userList = await dept.find({ deptName: { $in: [ '人事部门', '财务部门' ] } });

      // 当前审批负责人
      const curAudtiUserName = dept.userName;
      // 组装审批用户与审批流程，当前部门负责人 -> 人事部门负责人 -> 财务部门负责人
      let auditUsers = curAudtiUserName;
      const auditFlows = [{
        userId: dept.userId, userName: dept.userName, userEmail: dept.userEmail,
      }];
      userList.forEach(item => {
        auditUsers += `，${item.userName}`;
        auditFlows.push({
          userId: item.userId, userName: item.userName, userEmail: item.userEmail,
        });
      });

      params.auditUsers = auditUsers;
      params.curAuditUserName = dept.userName;
      params.auditFlows = auditFlows;
      params.auditLogs = []; // 各个负责人审批后会产生一条日志插入数组中
      params.applyUser = {
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
      };

      await leave.save(params);
      this.success({}, '申请成功');
    } else {
      // 软删除，将申请状态改为作废即可
      await leave.save({ id, applyState: 5 });
      this.success({}, '作废成功');
    }
  }

  async approve() {
    const data = this.ctx.state.user;
    const { id, action, remark } = this.ctx.request.body;
    const { leave } = this.ctx.service;
    const params = {};
    const doc = await leave.findOne({ id });
    if (doc) params.auditLogs = doc.auditLogs;
    if (action === 'refuse') {
      params.applyState = 3;
    } else if (action === 'pass') {
      if (doc.auditFlows.length === doc.auditLogs.length) { // 审核流程已满
        return this.success('当前申请单已处理，请勿重复提交');
      } else if (doc.auditFlows.length === doc.auditLogs.length + 1) { // 最后一级审批
        params.applyState = 4; // 审批通过
      } else if (doc.auditFlows.length > doc.auditLogs.length) {
        params.applyState = 2;
        params.curAuditUserName = doc.auditFlows[doc.auditLogs.length + 1].userName;
      }
    } else {
      return this.fail('参数错误');
    }

    params.auditLogs.push({
      userId: data.userId,
      userName: data.userName,
      createTime: new Date(),
      remark,
      action: action === 'refuse' ? '审核拒绝' : '审核通过',
    });

    const result = await leave.save({ id, ...params });
    this.success(result, '处理成功');
  }

  async count() {
    const data = this.ctx.state.user;
    const { leave } = this.ctx.service;
    const total = await leave.findCount({
      curAuditUserName: data.userName,
      applyState: { $in: [ 1, 2 ] },
    });
    this.success(total);
  }
}


module.exports = LeaveController;
