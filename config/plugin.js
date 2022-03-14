/* 
  ! 启用插件
*/

exports.mongoose = {
  ebable: true,
  package: 'egg-mongoose'
}

exports.validate = {
  enable: true,
  package: 'egg-validate'
};

// 跨域请求
exports.cors = {
  enable: true,
  package: 'egg-cors'
}