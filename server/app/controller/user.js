'use strict';

const BaseController = require('../core/base');
class UserController extends BaseController {
  async save() {
    const { user } = this.ctx.service;
    const { userName, userEmail, deptId, action } = this.ctx.request.body;
    if (action === 'add') {
      if (!userName || !userEmail || !deptId) {
        this.fail('参数错误', this.CODE.PARAM_ERROR);
      }
      // 暂时只支持邮箱
      let result = await user.findOne({ userEmail });
      if (result) this.fail(`系统检测到有重复用户：${userEmail}`);
      result = await user.save(this.ctx.request.body);
      if (!result) { this.fail('添加失败'); }
      this.success(result);
    } else {
      // 编辑
      if (!deptId) this.fail('部门不能为空');
      const result = await user.save(this.ctx.request.body);
      if (!result) { this.fail('更新失败'); }
      this.success({});
    }
  }
  async list() {
    const { userId, userName, state } = this.ctx.query;
    const { user } = this.ctx.model.service;
    const result = await user.list({ userId, userName, state });
    // 分页
    this.success(result);
  }
  async login() {
    const { user } = this.ctx.service;
    const body = this.ctx.request.body;
    const person = await user.login(body);

    if (person) {
      const token = this.ctx.service.user.sign({
        person,
      });
      // 用于api请求验证
      this.success(token);
    } else {
      this.fail();
    }
  }

  async remove() {
    const { userIds = [] } = this.ctx.request.body;
    const { user } = this.ctx.service;
    let count = 0;
    if (userIds.length) {
      for (const id of userIds) {
        const ret = await user.remove(id);
        if (ret) count += 1;
      }
    }
    this.success('', `共删除${count}条数据`);
  }
  // 在职人员列表
  async allList() {
    const { user } = this.ctx.service;
    const data = await user.find({ state: 1 });
    this.success(data);
  }
}

module.exports = UserController;
