'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.CODE = {
      SUCCESS: 200,
      PARAM_ERROR: 10001, // 参数不正确
      USER_ACCOUNT_ERROR: 20001, // 用户账号密码错误
      USER_LOGIN_ERROR: 20002, // 用户未登录
      BUSINESS_ERROR: 30001, // 业务请求失败
      AUTH_ERROR: 50001, // 认证失败或 token 过期
    };
  }
  success(data = '', msg = '', code = this.CODE.SUCCESS) {
    this.ctx.body = {
      code,
      data,
      msg,
    };
  }

  fail(msg = '', code = this.CODE.BUSINESS_ERROR, data = '') {
    this.ctx.body = {
      code,
      data,
      msg,
    };
  }
}

module.exports = BaseController;
