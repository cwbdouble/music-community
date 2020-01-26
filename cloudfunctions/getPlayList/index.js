// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const rp = require('request-promise');
const URL = 'http://musicapi.xiecheng.live/personalized';
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // 获取原来的playlist数据
  const oldPlayList = await db.collection('playlist').get()
  // 存放新数据的数组
  const newList = []

  const playlist = await rp(URL).then((res)=>{
    return JSON.parse(res).result
  })
  //去重
  for(let i=0;i<playlist.length;i++){
    let flag = true
    for(let j=0;j<oldPlayList.data.length;j++){
      if(oldPlayList.data[j].id===playlist[i].id){
        flag = false
        break
      }
    }
    if(flag){
      newList.push(playlist[i])
    }
  }
  // 插入数据
  for (let i = 0; i < newList.length;i++){
    await db.collection('playlist').add({
      data:{
        ...newList[i],
        createTime:db.serverDate()
      }
    }).then((res)=>{
      console.log('插入成功')
    }).catch((err)=>{
      console.log('失败')
    })
  }
  return newList.length
}