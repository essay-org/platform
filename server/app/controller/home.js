'use strict';

const BaseController = require('../core/base');

class HomeController extends BaseController {
  async index() {
    await this.ctx.render('home.ejs');
  }
}


module.exports = HomeController;
