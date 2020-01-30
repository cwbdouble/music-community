// pages/player/player.js
let playingIndex = -1;
let musicList = []
//获取全局唯一的背景音乐播放管理器
const musicControl = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picurl:'',
    isPlaying: false,
    isShowLyric: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    playingIndex = options.index
    musicList = wx.getStorageSync(
      'musicList'
    )
    this._loadMusicDetail(options.musicId)
  },
  _loadMusicDetail(musicId){
    musicControl.stop()
    let music = musicList[playingIndex]
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picurl: music.al.picUrl,
      isPlaying: false
    })
    wx.showLoading({
      title: '歌曲正在加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'musicUrl',
        musicId
      }
    }).then((res)=>{
      console.log(res)
      let result = res.result.data[0]
      musicControl.title = music.name
      musicControl.src = result.url
      musicControl.coverImgUrl = music.al.picUrl
      musicControl.singer = music.ar[0].name
      this.setData({
        isPlaying:true
      })
      wx.hideLoading()
      
    })

  },
  togglePlaying(){
    if(this.data.isPlaying){
      musicControl.pause()
    }else{
      musicControl.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onPrev(){
    playingIndex--;
    if(playingIndex<0){
      playingIndex = musicList.length-1
    }
    this._loadMusicDetail(musicList[playingIndex].id)
  },
  onNext(){
    playingIndex++
    if(playingIndex>musicList.length){
      playingIndex = 0
    }
    this._loadMusicDetail(musicList[playingIndex].id)
  },
  handleShowLyric(){
    this.setData({
      isShowLyric: !this.data.isShowLyric
    })
  }
})