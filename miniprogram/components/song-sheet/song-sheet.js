// components/song-sheet/song-sheet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    song:{
      type: Object
    }
  },
  // 监听器
  observers:{
    ['song.playCount'](val){
      
      this.setData({
        _count : this._traceNum(val,2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //将数字转为万位和亿位,point表示保留小数点后几位
    _traceNum(val,point){
      let str = val.toString().split('.')[0];
      if(str.length<5){
        return str;
      }else if(str.length>=5 && str.length<=8){
        let decimal = str.substring(str.length-4,str.length-4+point)
        return parseFloat(parseInt(val/10000)+'.'+decimal)+'万' 
      }else if(str.length>8){
        let decimal = str.substring(str.length-8,str.length-8+point)
        return parseFloat(parseInt(val/100000000)+'.'+decimal)+'亿' 
      }
    }
  }
})
