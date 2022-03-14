/* eslint valid-jsdoc: "off" */

'use strict';

const error_handler = require("../app/middleware/error_handler");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1637412022625_1619';

  // add your middleware config here
  config.middleware = ['errorHandler' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/youtube-clone',
      options: {
        useUnifiedTopology: true
      },
      // mongoose global plugins, expected a function or an array of function and options
      plugins: [],
    },
  };

  // 安全，可靠性的相关配置
  config.security = {
    // 处于开发方便的需求，暂时关闭CSRF防护
    csrf: {
      enable: false
    }
  };

  //  私钥
  config.jwt = {
    secret: 'c4390b68-dbc6-45e2-b707-7ef4bb9e4d13',
    expiresIn: '1y'
  }
  
  // 设置跨域请求
  config.cors = {
    // 默认所有的地址都可以跨域请求
    origin: '*'
    // {string|Function} origin: '*',
    // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  return {
    ...config,
    ...userConfig,
  };
};
