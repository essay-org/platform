'use strict';

const BaseController = require('../core/base');

const getTreeDept = function (rootList, parentId) {
  const list = [];
  for (let i = 0; i < rootList.length; i++) {
    const item = rootList[i];
    console.log(item);
    if (item.parentId.slice().pop() === parentId) {
      item.children = getTreeDept(rootList, item.id);
      if (item.children.length === 0) delete item.children;
      list.push(item);
    }
  }
  return list;
};

class DeptController extends BaseController {
  async save() {
    const { id, action } = this.ctx.request.body;
    const { dept } = this.ctx.service;
    if (action === 'add' || action === 'edit') {
      const result = await dept.save(this.ctx.request.body);
      if (!result) { this.fail('新增或编辑操作失败'); }
      this.success(result);
    } else if (action === 'detele') {
      await dept.remove(id);
      this.success();
    } else {
      this.fail('操作失败');
    }
  }

  async list() {
    // query有deptName，返回部门列表；没有返回树形结构
    const { query } = this.ctx.request;
    const { dept } = this.ctx.service;
    const rootList = await dept.find(query);
    if (query.deptName) {
      this.success(rootList);
    } else {
      const treeList = getTreeDept(rootList, null);
      this.success(treeList);
    }
  }
}

module.exports = DeptController;
