module.exports = function (app) {
    const {
      Bone,
      DataTypes: { STRING, DATE, JSON, BIGINT },
    } = app.model;
    class Menu extends Bone {
      static table = 'menu';
      static attributes = {
        id: {
          type: STRING,
          primaryKey: true,
        },
        menuName: {
          type: STRING,
          defaultValue: '',
          columnName: 'menuName'
        },
        menuType: {
          type: BIGINT,
          columnName: 'menuType'
        },
        menuState: {
          type: BIGINT,
          columnName: 'menuState',
        },
        // 权限标识
        menuCode: {
          type: STRING,
          defaultValue: '',
          columnName: 'menuCode',
        },
        // 路由地址
        path: {
          type: STRING,
          defaultValue: ''
        },
        // 图标名称
        icon: {
          type: STRING,
          defaultValue: ''
        },
        // 组件地址
        component: {
          type: STRING,
          defaultValue: ''
        },
        // 父级菜单ID ['', '']
        parentId: {
          type: STRING,
          columnName: 'parentId'
        },    
        updatedAt: {
          type: DATE,
          columnName: 'updatedAt',
        },
        createdAt: {
          type: DATE,
          columnName: 'createdAt'
        },
        deleteAt: {
          type: DATE,
          columnName: 'deleteAt'
        },
      };
    }
    return Menu;
  };
  