
var postsData = require('../posts-data.js')

var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    //当前页面
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId]
    this.setData({
      data: postData
    });


    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);

    }

    console.log(app.globalData.g_isPlay)
    //全局监听世博播报  
    if (app.globalData.g_isPlay && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlay: true
      })
    }

    //监听音乐播放器
    var that =this
    wx.onBackgroundAudioPlay(function(){
      that.setData({
        isPlay:true
      })
      app.globalData.g_isPlay = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    })
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlay: false
      })
      app.globalData.g_isPlay = false;
      app.globalData.g_currentMusicPostId =null;
    })

    console.log(this.data)
  },
  onCollectionTap: function (event) {
    //拿到这个缓存的值
    var postsCollected = wx.getStorageSync('posts_collected');
    //拿到这个值
    var postCollected = postsCollected[this.data.currentPostId];
    //取反操作 收藏的变成未收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    //更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);

    this.showModal(postsCollected, postCollected)
  },
  showModal: function (postsCollected, postCollected){
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected?'收藏这篇文章?':"取消收藏?",
      showCancel:'true',
      cancelText:"取消",
      cancelColor:"#333",
      confirmText:"确认",
      confirmColor:"green",
      success: function (res) {
        if (res.confirm) {
          that.showToast(postsCollected, postCollected)
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postCollected
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showToast: function (postsCollected, postCollected){
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 800,
      icon: 'success'
    })
  },
  onshare:function(){
    var itemList = [
      '分享到qq01',
      '分享到qq12',
      '分享到qq34',
      '分享到qq45'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor:'red',
      success:function(res){
        console.log(res)
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: 'ss',
        })
      }
    })
  },

  onmusic:function(){
    var currentPostId = this.data.currentPostId;
    var isPlay = this.data.isPlay;
    if(isPlay){
      wx.stopBackgroundAudio();
      this.setData({
        isPlay:false
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[currentPostId].music.url,
        coverImgUrl: postsData.postList[currentPostId].music.coverImg,
        title: postsData.postList[currentPostId].music.title
      })
      this.setData({
        isPlay:true
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (option) {
    
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