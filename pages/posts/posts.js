
const post_data = require('./posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date: post_data.postList
      })
  },

  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    console.log(event)
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+ postId
    })
  },
  onSweiperTap:function(e){
    var postId = e.target.dataset.postid;
    console.log(e)
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})