// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')


cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });
  app.router('bloglist', async (ctx,next)=>{
    ctx.body = await db.collection('blog')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime','desc')
      .get()
      .then((res)=>{
        return res
      })
  })

  return app.serve();

  
}