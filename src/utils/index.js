
export function isUrl(path) {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}


/**
 * 示例：/example//demo/  => /example/demo
 * @param {string} path 路由路径
 */
export function uniqueSlash(path) {
 return path.replace(/(?<!:)\/{2,}/g, '/')
}



/**
 * 渲染菜单至树形控件
 * @param {Array} menus 所有菜单
 * @param {Number | null} parentId 父级菜单ID
 * @param {number[]|string[]} keyPath ID路径
 */

export function formatMenu2Tree(menus, parentId, keyPath = []) {
  return menus
    .filter((item) => item.parentId === parentId)
    .map((item) => {
      const _keyPath = keyPath.concat(parentId || []);
      const arr = formatMenu2Tree(menus, item.id, _keyPath);
      return Object.assign(item, {
        keyPath: _keyPath,
        title: item.name,
        key: item.id,
        value: item.id,
        formData: item,
        children: arr.length ? arr : null,
      });
    });
}

/*
 * 渲染部门至树形控件
 * @param {Array} depts 所有部门
 * @param {Number | null} parentId 父级部门ID
 * @param {number[]|string[]} keyPath ID路径
 */
export const formatDept2Tree = (
  depts,
  parentId,
  keyPath = [],
) => {
  return depts
    .filter((item) => item.parentId === parentId)
    .map((item) => {
      const _keyPath = keyPath.concat(parentId || []);
      const arr = formatDept2Tree(depts, item.id, _keyPath);
      return Object.assign(item, {
        keyPath: _keyPath,
        title: item.name,
        key: item.id,
        value: item.id,
        formData: item,
        children: arr.length ? arr : null,
      });
    });
};



/**
 * 在树中根据ID找child
 * @param {string|number} id
 * @param {any[]} treeData 树形数据
 * @param {string} keyName 指定ID的属性名，默认是id
 * @param {string} children 指定children的属性名，默认是children
 */

export const findChildById = (
  id,
  treeData = [],
  keyName = 'id',
  children = 'children',
) => {
  return treeData.reduce((prev, curr) => {
    if (curr[keyName] === id) {
      return curr;
    }
    if (prev) {
      return prev;
    }
    if (curr[children]?.length) {
      return findChildById(id, curr[children], keyName, children);
    }
  }, undefined);
};
