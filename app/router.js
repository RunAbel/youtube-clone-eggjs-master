'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth()
  
  /* 
     ! 用户基本信息
  */
  // 设置基础路径
  router
    .prefix('/api/v1')
  
  // 用户注册
    .post('/users', controller.user.create)
  // 用户登录
    .post('/users/login', controller.user.login)
  // 获取当前用户
    .get('/user', auth, controller.user.getCurrentUser)
  // 更新当前用户
    .patch('/user', auth, controller.user.update)
  // 获取频道信息
    .get('/users/:userId', app.middleware.auth({ required: false }), controller.user.getUser)

  /* 
    ! 用户订阅功能
  */
  // 用户订阅
    .post('/users/:userId/subscribe', auth, controller.user.subscribe)
  // 取消订阅
    .delete('/users/:userId/subscribe', auth, controller.user.unsubscribe)
  // 获取用户订阅的频道列表
    .get('/users/:userId/subscriptions', controller.user.getSubscriptions)

  /* 
    ! 视频相关功能 阿里云 VOD
  */
  // 获取视频上传地址与凭证
    .get('/vod/CreateUploadVideo', auth, controller.vod.createUploadVideo)
  // 刷新视频上传地址与凭证
    .get('/vod/RefreshUploadVideo', auth, controller.vod.refreshUploadVideo)
    // 创建视频
    .post('/videos', auth, controller.video.createVideo)
    // 获取视频详细信息
    .get('/videos/:id', app.middleware.auth({ required: false }), controller.video.getVideo)
    // 获取视频列表
    .get('/videos', controller.video.getVideos)
    // 获取用户发布的视频列表
    .get('/users/:userId/videos', controller.video.getUserVideos)
    // 获取用户关注的频道视频列表
    .get('/user/videos/feed', auth, controller.video.getUserFeedVideos)
    // 更新视频信息
    .patch('/videos/:videoId', auth, controller.video.updateVideo)
    // 删除视频
    .delete('/videos/:videoId', auth, controller.video.deleteVideo)
    // 添加视频评论
    .post('/videos/:videoId/comment', auth, controller.video.createComment)
    // 获取视频评论列表
    .get('/videos/:videoId/comments', controller.video.getComments)
    // 删除视频评论
    .delete('/videos/:videoId/comments/:commentId', auth, controller.video.deleteComment)
    // 喜欢视频
    .post('/videos/:videoId/like', auth, controller.video.likeVideo)
    // 不喜欢视频
    .post('/videos/:videoId/dislike', auth, controller.video.dislikeVideo)
    // 获取用户喜欢视频的列表
    .get('/user/videos/liked', auth, controller.video.getUserLikedVideos)
};