'use strict';
const { uid } = require('uid');
const Service = require('egg').Service;

class RoleService extends Service {
  async remove(id) {
    const { Role } = this.ctx.model;
    return await Role.remove({ id });
  }

  //   添加和编辑
  async save({ id = '', ...rest }) {
    const { Role } = this.ctx.model;
    let result = await Role.findOne({
      id,
    });
    if (result) {
      await Role.update(
        { id },
        {
          ...rest,
        }
      );
    } else {
      const id = uid();
      result = await Role.create({
        id,
        ...rest,
      });
      result.id = id;
    }
    return result;
  }
  async findAll() {
    return await this.ctx.model.Role.find();
  }
  async find(data) {
    const params = {};
    const { roleName, pageSize, pageNum } = data;
    const { page, skipIndex } = this.ctx.helper.pager({ pageSize, pageNum });
    if (data.roleName) params.roleName = roleName;
    const total = await this.ctx.model.Role.find(params).count();
    const result = await this.ctx.model.Role.find(params).limit(page.pageSize)
      .offset(skipIndex);
    return {
      list: result,
      page: {
        ...page,
        total,
      },
    };
  }
}


module.exports = RoleService;
