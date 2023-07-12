'use strict';

// const isInstall = require('./middleware/isInstall');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const { auth } = middleware;
  router.prefix('/api');
  // users
  router.post('/users/login', controller.user.login);
  router.get('/users/list', auth(), controller.user.list);
  router.post('/users/delete', auth(), controller.user.remove);
  router.post('/users/operate', auth(), controller.user.save);
  router.get('/users/all/list', auth(), controller.user.allList);
  router.get('/users/getPermissionList', auth(), controller.menu.permissionList);
  // roles
  router.get('/roles/allList', auth(), controller.role.allList);
  router.get('/roles/list', auth(), controller.role.list);
  router.post('/roles/operate', auth(), controller.role.save);
  router.post('/roles/update/permission', auth(), controller.role.upadte);
  // menus
  router.post('/menu/operate', auth(), controller.menu.save);
  router.get('/menu/list', auth(), controller.menu.list);
  // dept
  router.get('/dept/list', auth(), controller.dept.list);
  router.post('/dept/operate', auth(), controller.dept.save);
  // leave
  router.get('/leave/list', auth(), controller.leave.list);
  router.post('/leave/operate', auth(), controller.leave.save);
  router.post('/leave/approve', auth(), controller.leave.approve);
  router.get('/leave/count', auth(), controller.leave.count);

  router.get('*', controller.home.index);
};
