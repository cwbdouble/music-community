// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let current = -1//当前时间
let duration = -1
let isMoving = false//是否拖动
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  

  /**
   * 组件的初始数据
   */
  data: {
    showTimer:{
      currentTime: '00:00',
      totalTime:'00:00'
    },
    //进度条白球移动距离
    movableDis:0,
    //白色进度条
    progress:0
  },
  lifetimes:{
    ready(){
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //拖动时触发
    onChange(event){
      
      if(event.detail.source=='touch'){
        this.data.progress = event.detail.x/(movableAreaWidth-movableViewWidth) * 100
        this.data.movableDis = event.detail.x
      }
      isMoving = true
    },
    //拖动离开后才触发setData 提升性能
    onTouchEnd(){
      let currentTime = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTimer.currentTime']: `${currentTime.min}:${currentTime.sec}`
      })
      backgroundAudioManager.seek(duration*this.data.progress/100)
    },

    _getMovableDis(){
      //获取Dom信息
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect)=>{
        console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },

    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        console.log('Pause')
        
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        // console.log(backgroundAudioManager.duration)
        if(typeof backgroundAudioManager.duration != 'undefined'){
          this._setTime()
        }else{
          setTimeout(()=>{
            this._setTime()
          },1000)
        }
        
      })

      backgroundAudioManager.onTimeUpdate(() => {
        // console.log('onTimeUpdate')
        if(!isMoving){
          let currentTime = backgroundAudioManager.currentTime
          duration = backgroundAudioManager.duration
          let currentTimeFmt = this._dateFormat(currentTime)
          if (current != currentTime.toString().split('.')[0]) {
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTimer.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            current = currentTime.toString().split('.')[0]
            // console.log(current)
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        console.log("onEnded")
        this.triggerEvent('musicEnd')
        
      })

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },
    _setTime(){
      let duration = backgroundAudioManager.duration
      console.log(duration)
      const durationFmt = this._dateFormat(duration)
      this.setData({
        ['showTimer.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    _dateFormat(sec){
      let min = Math.floor(sec/60)
      let seconds = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(seconds)
      } 
    },
    _parse0(sec){
      return sec<10 ? '0'+sec:sec
    }

  }
})
