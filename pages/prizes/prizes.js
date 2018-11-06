// pages/prizes/prizes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prizeImg: [
      '../../image/banner.jpg', '../../image/banner.jpg', '../../image/banner.jpg', '../../image/banner.jpg', '../../image/banner.jpg', '../../image/banner.jpg'
    ]
  },
  // 点击预览图片
  previewImage: function(e) {
    console.log(e);
    let current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.prizeImg
    })
  },
  // 点击跳转评论区
  reviewArea: function() {
    wx.navigateTo({
      url: '../reviewArea/reviewArea',
    })
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