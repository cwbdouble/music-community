// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    place: '请输入关键字',
    showModal: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },
  _loadBlogList(){
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url:'bloglist',
        start: 0,
        count: 10
      }
    }).then((res)=>{
      console.log(res)
      this.setData({
        list: res.result.data
      })
    })
  },
  handlePublish(){
    wx.getSetting({
      success: (res)=>{
        console.log(res)
        if(res.authSetting['scope.userInfo']){
          this.setData({
            showModal: false
          })
          wx.getUserInfo({
            success:(res)=>{
              console.log(res)
              this.onLoginSuccess(res.userInfo)
            }
          })
          
        }else{
          console.log('未授权')
          this.setData({
            showModal: true
          })
        }
      }
    })
  },

  onLoginSuccess(event){
    console.log(event) 
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${event.nickName}&avateUrl=${event.avatarUrl}`,
    })
  },
  onLoginFail(){
    wx.showModal({
      title: '未授权不能发布'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})