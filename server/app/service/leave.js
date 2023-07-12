'use strict';
const { uid } = require('uid');
const Service = require('egg').Service;

class LeaveService extends Service {

  //   添加和编辑
  async save({ id = '', ...rest }) {
    const { Leave } = this.ctx.model;
    let result = await Leave.findOne({
      id,
    });
    if (result) {
      await Leave.update(
        { id },
        {
          ...rest,
        }
      );
    } else {
      result = await Leave.create({
        id: uid(),
        ...rest,
      });
    }
    return result;
  }

  async find(data) {
    const result = await this.ctx.model.Leave.find(data);
    return result;
  }
  async findOne(data) {
    const result = await this.ctx.model.Leave.findOne(data);
    return result;
  }
  async findCount(data) {
    const result = await this.ctx.model.Leave.find(data).count();
    return result;
  }
}


module.exports = LeaveService;
