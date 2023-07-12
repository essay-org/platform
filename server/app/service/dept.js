'use strict';
const { uid } = require('uid');
const Service = require('egg').Service;

class DeptService extends Service {
  async remove(id) {
    const { Dept } = this.ctx.model;
    return await Dept.remove({ id });
  }

  //   添加和编辑
  async save({ id = '', ...rest }) {
    const { Dept } = this.ctx.model;
    let result = await Dept.findOne({
      id,
    });
    if (result) {
      await Dept.update(
        { id },
        {
          ...rest,
        }
      );
    } else {
      result = await Dept.create({
        id: uid(),
        ...rest,
      });
    }
    return result;
  }

  async find(data) {
    const result = await this.ctx.model.Dept.find(data);
    return result;
  }
  async findOne(data) {
    const result = await this.ctx.model.Dept.findOne(data);
    return result;
  }
}


module.exports = DeptService;
