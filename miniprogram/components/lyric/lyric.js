// components/lyric/lyric.js
let lineHeight = 0//行高
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowLyric:{
      type: Boolean,
      value: false
    },
    lyric: String
  },

  lifetimes:{
    ready(){
      wx.getSystemInfo({
        success(res) {
          console.log(res)
          lineHeight = res.screenWidth/750 * 64 
        },
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList:[],
    nowIndex: -1,//正在播放的index
    scrollTop: 0//歌词滚动的距离
  },
  observers:{
    lyric(lyc){
      if(lyc == ''){
        this.setData({
          lrcList:[{
            lrc:'暂无歌词',
            time: 0
          }],
          nowIndex: -1

        })
      }else{
        this._parseLyric(lyc)
      }
      
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime){
      // console.log(currentTime)
      let lyric = this.data.lrcList
      if(lyric.length == 0){
        return
      }
      if(currentTime > lyric[lyric.length-1].time){
        if(this.data.nowIndex != -1){
          this.setData({
            nowIndex: -1,
            scrollTop: lyric.length * lineHeight
          })
        }
        
      }
      for(let i=0; i<lyric.length;i++){
        if(currentTime <= lyric[i].time){
          this.setData({
            nowIndex : i - 1,
            scrollTop : (i-1)*lineHeight
          })
          break
        }
      }
    },
    _parseLyric(lyc){
      let line = lyc.split('\n');
      let _lrcList = []
      line.forEach((elem)=>{
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time != null){
          //歌词
          let lrc = elem.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // console.log(timeReg)
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lrcList.push({
            lrc,
            time: time2Seconds,
          })
        }
        
      })
      this.setData({
        lrcList: _lrcList
      })
    }
  }
})
