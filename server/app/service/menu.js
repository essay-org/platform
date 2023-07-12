'use strict';
const { uid } = require('uid');
const Service = require('egg').Service;

class MenuService extends Service {
  async remove(id) {
    const { Menu } = this.ctx.model;
    return await Menu.remove({ id });
  }

  //   添加和编辑
  async save({ id = '', ...rest }) {
    const { Menu } = this.ctx.model;
    let result = await Menu.findOne({
      id,
    });
    if (result) {
      await Menu.update(
        { id },
        {
          ...rest,
        }
      );
    } else {
      result = await Menu.create({
        id: uid(),
        ...rest,
      });
    }
    return result;
  }

  async find(data) {
    const result = await this.ctx.model.Menu.find(data);
    return result;
  }
}


module.exports = MenuService;
