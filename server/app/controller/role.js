'use strict';

const BaseController = require('../core/base');

class RoleController extends BaseController {
  async allList() {
    const { role } = this.ctx.service;
    const result = await role.findAll();
    this.success(result);
  }

  async list() {
    // { roleName }
    const query = this.ctx.request.query;
    const { role } = this.ctx.service;
    const result = await role.find(query);
    this.success(result);
  }

  async save() {
    const { id, action, roleName, remark } = this.ctx.request.body;
    const { role } = this.ctx.service;
    if (action === 'add' || action === 'edit') {
      const result = await role.save({
        id,
        roleName,
        remark,
      });
      if (!result) { this.fail('新增或编辑操作失败'); }
      this.success(result);
    } else if (action === 'detele') {
      await role.remove(id);
      this.success();
    } else {
      this.fail('操作失败');
    }
  }

  async upadte() {
    const { id, permissionList } = this.ctx.request.body;
    const { role } = this.ctx.service;
    const result = await role.save({
      id,
      permissionList,
    });
    this.success(result, '设置成功');
  }
}


module.exports = RoleController;
