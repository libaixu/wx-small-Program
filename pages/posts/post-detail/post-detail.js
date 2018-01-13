var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    });
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      });
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }
    // 监听全局变量
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.currentPostId) {
      this.setData({
        isPlayingMusic: true
      });
    }
    // 总控开关控制音乐播放图标
    var that = this;
    wx.onBackgroundAudioPlay(() => {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
    });
    wx.onBackgroundAudioPause(() => {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });

  },
  onCollectionTap: function (options) {
    this.getPostsCollectedSync();
    // this.getPostsCollectedAsync();
  },
  getPostsCollectedAsync: function () {
    var _self = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[_self.data.currentPostId];
        // 收藏状态取反
        postCollected = !postCollected;
        postsCollected[_self.data.currentPostId] = postCollected;
        _self.showToast(postsCollected, postCollected)
      },
    })
  },
  getPostsCollectedSync: function () {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏状态取反
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected)
  },
  showModal: function (postsCollected, postCollected) {
    var _self = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？' : '取消收藏该文章？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#666',
      confirmText: '确定',
      confirmColor: '#405f80',
      success: function (res) {
        if (res.confirm) {
          // 更新文章是否有缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定变量，实现图片切换
          _self.setData({
            collected: postCollected
          });
        }
      }
    })
  },

  showToast: function (postsCollected, postCollected) {
    var _self = this;
    // 更新文章是否有缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，实现图片切换
    _self.setData({
      collected: postCollected
    });

    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      duration: 1000
    })
  },
  onShareTap: function (event) {
    wx.showActionSheet({
      itemList: [
        "分享给微信好友",
        "分享到朋友圈",
        "分享到QQ",
        "分享到微博"
      ],
      itemColor: "#405f80",
      success: function (res) {
        console.log('123');
      }
    })
  },
  onMusicTap: function (event) {
    var currentId = this.data.currentPostId;
    var postData = postsData.postList[currentId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
    }
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