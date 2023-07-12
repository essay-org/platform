'use strict';
const { uid } = require('uid');
const svgCaptcha = require('svg-captcha');
const fs = require('fs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const Service = require('egg').Service;

class UserService extends Service {
  async save({ userPwd, userEmail, ...rest }) {
    const { User } = this.ctx.model;
    let result = await User.findOne({
      userEmail,
    });
    if (userPwd) {
      userPwd = md5(userPwd);
    }
    if (result) {
      await User.update(
        { userEmail },
        {
          ...rest,
        }
      );
    } else {
      result = await User.create({
        id: uid(),
        ...rest,
        userPwd,
      });
    }
    return result;
  }

  async findOne({ userEmail }) {
    const { User } = this.ctx.model;
    return await User.findOne({
      userEmail,
    });
  }
  async remove(id) {
    const { User } = this.ctx.model;
    return await User.remove({ id });
  }
  async login({ userName, userPwd }) {
    const { User } = this.ctx.model;
    const result = await User.findOne({
      userName,
      userPwd: md5(userPwd),
    }).select(
      'userId',
      'userName',
      'userEmail',
      'state',
      'role',
      'deptId',
      'roleList'
    );

    return result;
  }
  async list(data) {
    const { User } = this.ctx.model;
    return await User.find(data);
  }
  // 过期时间单位是秒，这里默认7天有效期
  sign(data) {
    const key = this.config.keys;
    const token = jwt.sign(
      {
        ...data,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      key
    );
    return token;
  }

  verify(token) {
    const key = this.config.keys;
    return jwt.verify(token, key, (err, decoded) => {
      if (err) {
        // JWT验证失败，可能是过期或无效
        this.logger.warn('token 验证失败', err);
        return {
          status: -1,
          data: 'token解析失败',
        };
      }
      // JWT验证成功 当前时间的UNIX时间戳
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        this.logger.warn('token 无效');
        // JWT已过期
        return {
          status: 0,
          data: 'token已过期',
        };
      }
      // JWT仍然有效
      return {
        status: 1,
        data: decoded,
      };
    });
  }

  loginStatus() {
    const token = this.ctx.get('Token') || this.ctx.cookies.get('Token');
    const loginStatus = this.verify(token);
    return loginStatus;
  }
}

module.exports = UserService;
