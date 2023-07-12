'use strict';

const BaseController = require('../core/base');

// 递归拼接树形菜单列表
const getTreeMenu = function(rootList, parentId) {
  const list = [];
  for (let i = 0; i < rootList.length; i++) {
    // rootList[i] 是一个 mongoose 查询对象，其中就有暴露出来的字段，但还是需要通过 _doc 拿到集合中真正的数据
    const item = rootList[i];
    // 只要 item.parentId 的最后一个与当前传入的 parentId 相同，那么 item 就属于 children，放入 list 返回出去
    if (item.parentId[item.parentId.length - 1] === parentId) {
      item.children = getTreeMenu(rootList, item.id);
      // 如果没有子项，则将 children 属性删除
      if (item.children.length === 0) delete item.children;
      else if (item.children[0].menuType === 2) {
        // action 用于快速区分按钮和菜单，用于后期做菜单按钮权限控制
        item.action = item.children;
      }
      list.push(item);
    }
  }
  return list;
};

const getActionList = function(list) {
  const actionList = [];
  const deep = arr => {
    while (arr.length) {
      const item = arr.pop();
      if (item.action) {
        item.action.forEach(action => {
          actionList.push(action.menuCode);
        });
      }
      if (item.children && !item.action) {
        deep(item.children);
      }
    }
  };
  deep(list);
  return actionList;
};

class MenuController extends BaseController {
  async save() {
    const { menu } = this.ctx.service;
    const { id, action, ...rest } = this.ctx.request.body;
    let result = null;
    if (action === 'add' || action === 'edit') {
      result = await menu.save({ id, ...rest });
    } else {
      // delete: 要删除子菜单，使用事务
      result = await menu.remove(id);
    }

    if (!result) this.fail('操作失败');
    this.success(result);
  }

  async list() {
    // menuName, menuState
    const query = this.ctx.request.query;
    const { menu } = this.ctx.service;
    const menus = await menu.find(query);
    const permissionList = getTreeMenu(menus, null);
    this.success(permissionList);
  }

  async permissionList(data) {
    const menuList = await this.getMenuList(data.role, data.roleList);
    const actionList = getActionList(JSON.parse(JSON.stringify(menuList)));
    this.success({
      menuList,
      actionList,
    });
  }


  async getMenuList(userRole, roleKeys) {
    let list = [];
    const { menu, role } = this.ctx.service;
    if (userRole === 0) {
      list = await menu.find();
    } else {
      list = await role.find({ id: { $in: roleKeys } });
      let permissionList = [];
      list.forEach(role => {
        const { checkedKeys, halfCheckedKeys } = role.permissionList;
        permissionList = permissionList.concat([ ...checkedKeys, ...halfCheckedKeys ]);
      });
      // 获取所有权限后进行去重
      permissionList = [ ...new Set(permissionList) ];
      list = await menu.find({ id: { $in: permissionList } });
    }
    return getTreeMenu(list, null);
  }
}


module.exports = MenuController;
