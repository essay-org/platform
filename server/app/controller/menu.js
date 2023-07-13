'use strict';

const BaseController = require('../core/base');

// 递归拼接树形菜单列表
const getTreeMenu = function(rootList, parentId) {
  const list = [];
  for (let i = 0; i < rootList.length; i++) {
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

    if (!result) return this.fail('操作失败');
    this.success(result);
  }

  async list() {
    // menuName, menuState
    const query = this.ctx.request.query;
    const { menu } = this.ctx.service;
    const menus = await menu.find(query);
    console.log(menus);
    const permissionList = getTreeMenu(menus, undefined);
    this.success(permissionList);
  }

  // 用户拥有的菜单权限
  async permissionList() {
    const data = this.ctx.state.user;
    // console.log(11111111, data);
    const menuList = await this.getMenuList(data.role, data.roleList);
    const actionList = getActionList(JSON.parse(JSON.stringify(menuList)));
    this.success({
      menuList,
      actionList,
    });
  }

  // 内部方法
  async getMenuList(userRole, roleKeys) {
    console.log(userRole, roleKeys);
    let list = [];
    const { menu, role } = this.ctx.service;
    if (userRole === 0) {
      list = await menu.find();
    } else {
      list = await role.findAll({ id: { $in: roleKeys } });
      // list = JSON.parse(JSON.stringify(list));
      list = list.toObject();
      let permissionList = [];
      list.forEach(role => {
        if (role) {
          const { checkedKeys, halfCheckedKeys } = role.permissionList;
          permissionList = permissionList.concat([ ...checkedKeys, ...halfCheckedKeys ]);
        }
      });
      // 获取所有权限后进行去重
      permissionList = [ ...new Set(permissionList) ];
      list = await menu.find({ id: { $in: permissionList } });
    }
    return getTreeMenu(list, undefined);
  }
}


module.exports = MenuController;
