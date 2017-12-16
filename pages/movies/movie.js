var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    coming:{},
    top250:{},
    searchUrl:{},
    containerShow:true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var requestUrl = app.globalData.doubanBase
    var inTheaters = requestUrl+"/v2/movie/in_theaters"+"?start=0&count=3";
    var coming = requestUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250 = requestUrl + "/v2/movie/top250" + "?start=0&count=3";
    this.getRequestData(inTheaters, "inTheaters", "正在热映")
    this.getRequestData(coming, "coming", "即将上映")
    this.getRequestData(top250, "top250", "豆瓣Top250")

  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    }
    )
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },
  onBindBlur: function (event){
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getRequestData(searchUrl, "searchResult", "");
  },
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  getRequestData: function (url, settedKey, categoryTitle){
    var that = this
    wx.request({
      url: url,
      data: {},
      methods: "GET",
//不可以用json
      header: {
        'content-type': 'application/xml' // 默认值
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function () {
        console.log("fail")
      }
    })
  },
  processDoubanData: function (moviesDouban, settedKey, categoryTitle){
    var movies = [];
    for (var i in moviesDouban.subjects){
      var subject = moviesDouban.subjects[i];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);

  },

  //更多
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  }
})