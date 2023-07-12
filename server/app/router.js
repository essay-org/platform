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
  router.get('/users/list', controller.user.list);
  router.post('/users/delete', controller.user.remove);
  router.post('/users/operate', controller.user.save);
  router.get('/users/all/list', controller.user.allList);
  router.get('/users/getPermissionList', auth(), controller.menu.permissionList);
  // roles
  router.get('/roles/allList', controller.role.allList);
  router.get('/roles/list', controller.role.list);
  router.post('/roles/operate', controller.role.save);
  router.post('/roles/update/permission', controller.role.upadte);
  // menus
  router.post('/menu/operate', controller.menu.save);
  router.get('/menu/list', controller.menu.list);
  // dept
  router.get('/dept/list', controller.dept.list);
  router.post('/dept/operate', controller.dept.save);
  // leave
  router.get('/leave/list', controller.leave.list);
  router.post('/leave/operate', controller.leave.save);
  router.post('/leave/approve', controller.leave.approve);
  router.get('/leave/count', controller.leave.count);

  router.get('*', controller.home.index);
};
