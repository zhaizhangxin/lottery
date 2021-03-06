// pages/prizes/prizes.js
const reqUrl = require('../../utils/reqUrl');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 点击预览图片
  previewImage: function(e) {
    console.log(e);
    let current = e.target.dataset.src;
    let avartsrc = e.target.dataset.avartsrc;  
    wx.previewImage({
      current: current,
      urls: avartsrc
    })
  },
  // 点击跳转评论区
  reviewArea: function() {
    if (this.data.status === 1){
      wx.navigateTo({
        url: '../reviewArea/reviewArea',
      })
    }else{
      wx.showToast({
        title: '只有中奖过的用户才可以发布晒奖哦！',
        icon:'none',
        duration:1500
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var that = this;
    wx.request({
      url: reqUrl + 'award_comment',
      method: 'GET',
      data: {
        page: 1,
        rows: 10
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        that.setData({
          comments: res.data.msg.comment,
          status: res.data.msg
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})