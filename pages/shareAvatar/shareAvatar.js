// pages/avatar/avatar.js
const reqUrl = require('../../utils/reqUrl.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: '',
    avatar: '',

    page: 1,
    pageStatus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    if (options != undefined) {
      this.setData({
        options: options
      })
    }


    //获取好友助力信息
    wx.request({
      url: reqUrl + 'shareAvatar',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: this.data.options.id,
        user_id: this.data.options.uid
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        // console.log(res)

        if (res.statusCode == 200) {
          this.setData({
            avatar: res.data.msg
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
  onReady: function (options) {

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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.pageStatus && this.data.avatar.length % 200 == 0) {

      wx.showLoading({
        title: '加载中...',
        mask: true
      })

      wx.request({
        url: reqUrl + 'shareAvatar',
        header: {
          token: wx.getStorageSync('token')
        },
        data: {
          id: this.data.options.id,
          page: ++this.data.page,
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: res => {

          wx.hideLoading();

          if (res.statusCode == 200) {

            this.setData({
              avatar: this.data.avatar.concat(res.data.msg)
            })

            if (res.data.msg.length < 200) {

              this.setData({
                pageStatus: false
              })
            }

            // console.log(res)

          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true
            })

          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        mask: true
      })
    }
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