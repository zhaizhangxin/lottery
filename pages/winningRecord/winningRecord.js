// pages/lotteryRecord/lotteryRecord.js
const reqUrl = require('../../utils/reqUrl.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //获取中奖记录
    wx.request({
      url: reqUrl + 'order_list',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      success: res => {
        // console.log(res)
        if (res.statusCode == 200) {

          this.setData({
            msg: res.data.msg
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }

        wx.hideLoading();
      },
      fail: function (res) { },
      complete: function (res) { },
    })
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
    return {
      title: '先到先得！口袋喊你大奖一起免费拿',
      path: '/pages/login/login',
    }
  }
})