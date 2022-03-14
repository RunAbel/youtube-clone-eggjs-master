module.exports = (options = { require: true }) => {
    return async (ctx, next) => {
        // & 1.获取请求头中的token数据
        let token = ctx.headers['authorization'] // 默认存储token的格式： Bearer token数据
        token = token
            ? token.split('Bearer ')[1] // 删掉默认存储的前缀
            : null

        // & 2.验证token,无效则返回401
        if (token) {
            try {
                // & 3.token有效，则根据userId获取用户数据挂载到ctx对象中给后续中间件使用
                const data = ctx.service.user.verifyToken(token)
                ctx.user = await ctx.model.User.findById(data.userId)
            } catch (error) {
                ctx.throw(401)
            }
        } else if (options.required) {           
            ctx.throw(401)
        }

        // & 4.next执行后续中间件
        await next()
    }
}