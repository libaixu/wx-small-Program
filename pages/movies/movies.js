var app = getApp();
var utils = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    intheaters: {},
    comingsoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheaterUrl = app.globalData.goubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingSoon = app.globalData.goubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250 = app.globalData.goubanBase + '/v2/movie/top250' + '?start=0&count=3';

    this.getMovieList(inTheaterUrl, "正在上映的电影-北京", "intheaters");
    this.getMovieList(comingSoon, "即将上映的电影", "comingsoon");
    this.getMovieList(top250, "豆瓣电影Top250", "top250");
  },
  onGoMore: function (event) {
    var tit = event.currentTarget.dataset.more;
    wx.navigateTo({
      url: 'more-movies/more-movies?tit=' + tit
    });
  },
  toMovieDetail: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    });
  },
  // 获取数据公共方法
  getMovieList: function (url, tit, setedkey) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-type': 'json'
      },
      success: function (res) {
        that.processDoubanData(res.data, tit, setedkey);
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },

  // 数据处理
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
    }
    this.setData(readData);
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    });
  },
  onCancelSearchPanel: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    });
  },
  onBindConfirm: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.goubanBase + '/v2/movie/search?q=' + text;
    this.getMovieList(searchUrl, 'searchResult');
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