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
        },
        menuType: {
          type: BIGINT,
        },
        menuState: {
          type: BIGINT,
        },
        // 权限标识
        menuCode: {
          type: STRING,
          defaultValue: '',
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
          type: JSON,
        },
        order: {
          type: BIGINT,
          defaultValue: 0,
        },
        updatedAt: {
          type: DATE,
        },
        createdAt: {
          type: DATE,
        },
        deleteAt: {
          type: DATE,
        },
      };
    }
    return Menu;
  };
  