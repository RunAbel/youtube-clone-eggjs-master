'use strict';

const Controller = require('egg').Controller;

/* 
  用户登录名称 vod @1106569738506982.onaliyun.com
  AccessKey ID LTAI5t9A2bNt97edEmAuqZ7K
  AccessKey Secret IEJeidrrhDQTaj6Kpf44hk6uyfDTcT 
*/
class VodController extends Controller {
  // 获取视频上传地址与凭证
  async createUploadVideo() {
    // & 获取用户端传入 标题与文件
    const query = this.ctx.query
    this.ctx.validate({
      Title: { type: 'string' },
      FileName: { type: 'string' }
    }, query)
    // 获取实例化的客户端vod实例
      this.ctx.body = await this.app.VodClient.request("CreateUploadVideo", query, {})
  }

  // & 刷新视频上传地址与凭证
  async refreshUploadVideo() {
    // 获取用户端传入 标题与文件
    const query = this.ctx.query
    this.ctx.validate({
      VideoId: { type: 'string' }
    }, query)
    // 获取实例化的客户端vod实例
    this.ctx.body = await this.app.VodClient.request("RefreshUploadVideo", query, {})
  }

  
}

module.exports = VodController;
