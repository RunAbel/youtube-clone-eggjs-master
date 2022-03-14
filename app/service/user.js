/* 
    封装业务方法
*/
const Service = require('egg').Service
const jwt = require('jsonwebtoken')

class UserService extends Service {
    get User() {
        return this.app.model.User
    }
    findByUsername (username) {
        return this.User.findOne({
            username
        })
    }
    findByEmail (email) {
        return this.User.findOne({
            email
        }).select('+password')
    }
    async createUser (data) {
        // md 5 加密处理
        data.password = this.ctx.helper.md5(data.password)
        const user = new this.User(data)
        await user.save() // 保存到数据库中
        return user
    }
    /* 
        & 生成 token
    */
    createToken (data) {
        // 参数二为私钥，配置文件内保存
        return jwt.sign(data, this.app.config.jwt.secret, {
            expiresIn: this.app.config.jwt.expiresIn
        })
    }

    /* 
        & 验证 Token
    */
    verifyToken (token) {
        // jwt中自带有验证token的方法：verify
        return jwt.verify(token, this.app.config.jwt.secret)
    }
    /* 
        & 更新用户
    */
    updateUser (data) {
        // 调用内置方法，通过ID以及修改的数据项直接修改用户信息
        /*
            ! findByIdAndUpdate: 默认返回更新之前的数据
        */
        return this.User.findByIdAndUpdate(this.ctx.user._id, data, {
            new: true // 返回更新之后的数据
        })
    }
    /* 
        & 订阅操作
    */
    async subscribe (userId, channelId) {
        const { Subscription, User } = this.app.model
        // 1、检查是否已经订阅
        const record = await Subscription.findOne({
            user: userId,
            channel: channelId
        })
        const user = await User.findById(channelId)
        // 2、没有订阅、添加订阅
        if(!record) {
            await new Subscription({
                user: userId,
                channel: channelId
            }).save()
            // 更新用户订阅数量
            
            user.subscribersCount++
            await user.save() // 更新到数据库中

        }
        // 3、返回用户信息
        return user
    }
    /* 
    & 取消订阅操作
*/
    async unsubscribe(userId, channelId) {
        const { Subscription, User } = this.app.model
        // 1、检查是否已经订阅
        const record = await Subscription.findOne({
            user: userId,
            channel: channelId
        })
        const user = await User.findById(channelId)
        // 2、如果有订阅，则取消
        if (record) {
            await record.remove() // 删除订阅记录
            
            // 更新用户订阅数量
            user.subscribersCount--
            await user.save() // 更新到数据库中

        }
        // 3、返回用户信息
        return user
    }
}

module.exports = UserService