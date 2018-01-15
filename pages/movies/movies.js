var app = getApp();
var utils = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    intheaters: {},
    comingsoon: {},
    top250: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheaterUrl = app.globalData.goubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingSoon = app.globalData.goubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250 = app.globalData.goubanBase + '/v2/movie/top250' + '?start=0&count=3';

    this.getMovieList(inTheaterUrl, "intheaters");
    this.getMovieList(comingSoon, "comingsoon");
    this.getMovieList(top250, "top250");
  },
  // 获取数据公共方法
  getMovieList: function (url, setedkey) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-type': 'json'
      },
      success: function (res) {
        var tit = res.data.title;
        that.processDoubanData(res.data, tit, setedkey);
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },

  processDoubanData: function (doubanMovie, tit, setedkey) {
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
    var readData = {}
    readData[setedkey] = {
      tit: tit,
      movies: movies
    };
    this.setData(readData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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