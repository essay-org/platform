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
      const id = uid();
      result = await Leave.create({
        id,
        ...rest,
      });
      result.id = id;
    }
    return result;
  }

  async find(data) {
    const result = await this.ctx.model.Leave.find(data);
    return result;
  }
  async findOne({ pageNum, pageSize, ...rest }) {
    // const result = await this.ctx.model.Leave.findOne(data);
    const { page, skipIndex } = this.ctx.helper.pager({ pageSize, pageNum });
    const total = await this.ctx.model.Leave.find({ ...rest }).count();
    const result = await this.ctx.model.Leave.find({ ...rest }).limit(page.pageSize)
      .offset(skipIndex);
    return {
      list: result,
      page: {
        ...page,
        total,
      },
    };
  }
  async findCount(data) {
    const result = await this.ctx.model.Leave.find(data).count();
    return result;
  }
}


module.exports = LeaveService;
