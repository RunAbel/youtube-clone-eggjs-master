const Controller = require('egg').Controller

class UserController extends Controller {
    // ^ 用户注册
    async create() {
        // 1. 数据校验
        const userService = this.service.user
        const body = this.ctx.request.body
        // 检测是否传入参数
        this.ctx.validate({
            // !默认必填项
            username: { type: 'string' },
            email: { type: 'email' },
            password: { type: 'string' }
        })


        // 检测是否重复
        if (await userService.findByUsername(body.username)) {
            this.ctx.throw(422, '用户已存在')
        }
        if (await userService.findByEmail(body.email)) {
            this.ctx.throw(422, '邮箱已存在')
        }

        // 2. 保存用户
        const user = await userService.createUser(body)
        // 3. 生成 token
        /* 
            安装包：jsonwebtoken
        */
       const token = userService.createToken({
           userId: user._id
       })
        // 4. 发送响应
        this.ctx.body = {
            user: {
                email: user.email,
                token,
                username: user.username,
                channelDescription: user.channelDescription,
                avatar: user.avatar
            }
        }

    }
    // ^ 用户登录
    async login() {
        const userService = this.service.user
        // 获取用户登录信息 
        const body = this.ctx.request.body

        // & 1.基本数据验证
        this.ctx.validate({
            email: { type: 'email' },
            password: { type: 'string' }
        })

        // 通过 email 查询数据库
        const user = await userService.findByEmail(body.email)
        // & 2.校验邮箱是否存在
        if (!user) {
            this.ctx.throw(422, '用户不存在')            
        }
        // & 3.校验密码是否正确
        if (this.ctx.helper.md5(body.password) !== user.password) {
            this.ctx.throw(422, '密码不正确')
        }        
        // & 4.生成用户token
        const token = userService.createToken({
            userId: user._id
        })
        // & 5.发送响应请求
        this.ctx.body = {
            user: {
                email: user.email,
                token,
                username: user.username,
                channelDescription: user.channelDescription,
                avatar: user.avatar
            }
        }
    }
    // ^ 获取当前用户
    async getCurrentUser () {
        const user = this.ctx.user
        this.ctx.body = {
            user: {
                email: user.email,
                token: this.ctx.header['authorization'],
                username: user.username,
                channelDescription: user.channelDescription,
                avatar: user.avatar
            }
        }
    }
    // ^ 更新用户信息
    async update () {
        // 1.基本数据验证
        const body = this.ctx.request.body
        this.ctx.validate({
            email: { type: 'email', required: false },
            password: { type: 'string', required: false },
            username: { type: 'string', required: false },
            channelDescription: { type: 'string', required: false },
            avatar: { type: 'string', required: false }
        })
        // 2.校验用户是否已经存在
        const userService = this.service.user
        // 3.校验邮箱是否已经存在
        if (body.email) {
            if(body.email !== this.ctx.user.email && await userService.findByEmail(body.email)) {
                this.ctx.throw(422, 'email 已存在')
            }
        }
        // 4.校验用户名称是否存在
        if (body.username) {
            if(body.username !== this.ctx.user.username && await userService.findByUsername(body.username)) {
                this.ctx.throw(422, 'username 已存在')
            }
        }
        // 5.更新用户信息
        const user = await userService.updateUser(body)
        // 6.返回更新之后的用户信息
        this.ctx.body = {
            user: {
                email: user.email,
                password: user.password,
                username: user.username,
                channelDescription: user.channelDescription,
                avatar: user.avatar
            }
        }
    }
    // ^ 订阅
    async subscribe() {
        const userId = this.ctx.user._id // 用户自己的ID
        const channelId = this.ctx.params.userId // 将要订阅的频道ID
        // 1、用户不能订阅自己
        // ! 对象类型的比较方法：equals(mongoose 内置方法，专用于比对 object._id,内部原理等同于转换字符串比较)
        if(userId.equals(channelId)) {
            this.ctx.throw(422, '用户不能订阅自己')
        }
        // 2、添加用户
        const user = await this.service.user.subscribe(userId, channelId)
        // 3、发送响应逻辑
        this.ctx.body = {
            ...this.ctx.helper._.pick(user, [
                'username', 
                'email', 
                'avatar', 
                'cover',
                'channelDescription',
                'subscribersCount'
            ]),
            isSubscribed: true
        }
    }
    // ^ 取消订阅
    async unsubscribe() {
        const userId = this.ctx.user._id // 用户自己的ID
        const channelId = this.ctx.params.userId // 将要订阅的频道ID
        // 1、用户不能订阅自己
        // ! 对象类型的比较方法：equals(mongoose 内置方法，专用于比对 object._id,内部原理等同于转换字符串比较)
        if (userId.equals(channelId)) {
            this.ctx.throw(422, '用户不能订阅自己')
        }
        // 2、取消订阅
        const user = await this.service.user.unsubscribe(userId, channelId)
        // 3、发送响应逻辑
        this.ctx.body = {
            ...this.ctx.helper._.pick(user, [
                'username',
                'email',
                'avatar',
                'cover',
                'channelDescription',
                'subscribersCount'
            ]),
            isSubscribed: true
        }
    }
    // ^ 查看频道信息
    async getUser() {
        // 1、获取订阅状态
        let isSubscribed = false
        
        if (this.ctx.user) {
            // 获取订阅记录
            const record = await this.app.model.Subscription.findOne({
                user: this.ctx.user._id,
                channel: this.ctx.params.userId
            })
            if (record) {
                isSubscribed = true
            }
        }
        // 2、获取用户信息
        const user = await this.app.model.User.findById(this.ctx.params.userId)
        // 3、发送响应
        this.ctx.body = {
            user: {
                ...this.ctx.helper._.pick(user, [
                    'username',
                    'email',
                    'avatar',
                    'cover',
                    'channelDescription',
                    'subscribersCount'
                ]),
                isSubscribed
            }
        }
    }
    // ^ 获取用户订阅的视频列表
    async getSubscriptions() {
        const Subscription = this.app.model.Subscription
        let subscriptions = await Subscription.find({
            user: this.ctx.params.userId
        }).populate('channel')
        subscriptions = subscriptions.map(item => {
            return this.ctx.helper._.pick(item.channel, [
                '_id',
                'username',
                'avatar'
            ])
        })
        this.ctx.body = {
            subscriptions
        }
    }
}
 
module.exports = UserController