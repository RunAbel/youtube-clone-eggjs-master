'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const User = this.app.model.User
    await new User({
      username: 'lsp',
      password: '123456',
      email: 'runabel@outlook.com'
    }).save()
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
