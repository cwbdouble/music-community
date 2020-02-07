// pages/blog-edit/blog-edit.js
const MAX_LENGTH = 140;
const MAX_IMAGE_NUMS = 9;
const db = wx.cloud.database();
let userInfo = {}
let content = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNums: 0,
    bottomHeight: 0,
    imageList: [], //选中的图片列表
    showChoose: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    userInfo = options
  },
  onInput(event) {
    let valueLength = event.detail.value.length
    content = event.detail.value
    this.setData({
      wordsNums: valueLength
    })

    if (valueLength >= MAX_LENGTH) {
      this.setData({
        wordsNums: '最多140个字'
      })
    }
  },
  onFocus(event) {
    console.log(event)
    this.setData({
      bottomHeight: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      bottomHeight: 0
    })
  },
  chooseImage() {
    wx.chooseImage({
      count: MAX_IMAGE_NUMS - this.data.imageList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        this.setData({
          imageList: this.data.imageList.concat(res.tempFilePaths)
        })
        let max = MAX_IMAGE_NUMS - this.data.imageList.length
        this.setData({
          showChoose: max <= 0 ? false : true
        })
      },
    })

  },
  previewImage(event) {
    wx.previewImage({
      urls: this.data.imageList,
      current: event.target.dataset.imageindex
    })
  },
  deleteImage(event) {
    this.data.imageList.splice(event.target.dataset.index, 1)
    this.setData({
      imageList: this.data.imageList
    })
    if (this.data.imageList.length == MAX_IMAGE_NUMS - 1) {
      this.setData({
        showChoose: true
      })
    }
  },
  // 提交
  send() {
    // 1.发布后把图片上传到云存储，获取到fileID
    // 2.把openId,头像，用户名，图片fileId列表，发布内容，发布时间存到数据库中
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }
    let promiseArr = []
    let fileIds = []
    wx.showLoading({
      title: '发布中',
    })
    for (let i = 0; i < this.data.imageList.length; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.imageList[i]
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-'+Math.random() * 10000 + suffix,
          filePath: this.data.imageList[i],
          success: (res) => {
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            reject()
          }
        })
      })
      promiseArr.push(p)

    }

    Promise.all(promiseArr).then((res)=>{
      db.collection('blog').add({
        data:{
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate()
        }
      }).then((res)=>{
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
      }).catch((err)=>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
        })
      })
    })
  }
})