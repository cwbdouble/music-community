// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleGetUserInfo(event){
      console.log(event)
      if(event.detail.userInfo){
        this.setData({
          showModal: false
        })
        this.triggerEvent('loginSuccess',event.detail.userInfo)
      }else{
        this.triggerEvent('loginFail')
      }
    }
  }
})
