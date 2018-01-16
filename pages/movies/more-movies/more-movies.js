// pages/movies/more-movies/more-movies.js
var app = getApp();
var utils = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    tit: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tit = options.tit;
    this.data.tit = tit;
    var dataUrl = '';

    // 跳转电影列表
    switch (tit) {
      case "正在上映的电影-北京":
        dataUrl = app.globalData.goubanBase + '/v2/movie/in_theaters';
        break;
      case "即将上映的电影":
        dataUrl = app.globalData.goubanBase + '/v2/movie/coming_soon';
        break;
      case "豆瓣电影Top250":
        dataUrl = app.globalData.goubanBase + '/v2/movie/top250';
        break;
    }
    this.data.requestUrl = dataUrl;

    utils.http(dataUrl, this.processDoubanData);
  },

  // 数据处理
  processDoubanData: function (doubanMovie) {
    var movies = [];
    for (var index in doubanMovie.subjects) {
      var subject = doubanMovie.subjects[index];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...'
      }
      var temp = {
        stars: utils.coverTostarArray(subject.rating.stars),
        title: title,
        movieId: subject.id,
        average: subject.rating.average,
        coverImage: subject.images.large,
      }
      movies.push(temp);
    }

    // 上划加载更多数据
    var totalMovies = {}
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false
    }
    this.setData({
      movies: totalMovies,
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var tit = this.data.tit;
    wx.setNavigationBarTitle({
      title: tit
    });
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
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + '?start=0&count=20';

    this.data.movies = {}
    this.data.isEmpty = true;
    utils.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';

    utils.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})