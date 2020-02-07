// components/blog-card/blog-card.js
import fmtTime from '../../utils/formatTime.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: {
      type: Object
    }
  },
  observers:{
    ['blog.createTime'](val){
      // console.log(new Date(val))
      if(val){
        this.setData({
          time: fmtTime(new Date(val))
        })
      }
      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    time: ''
  },
  onReady:{

  },

  /**
   * 组件的方法列表
   */
  methods: {
    seeImage(event){
      wx.previewImage({
        urls: this.data.blog.img,
        current: event.target.dataset.current
      })
    }
  }
})
