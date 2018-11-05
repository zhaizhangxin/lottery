// pages/lottery/lottery.js
const reqUrl = require('../../utils/reqUrl');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailMsg: null,

    //url传参
    options: null,

  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.setData({
      options: options
    })


    //异步登录执行完的 resolve 
    getApp().login().then(res => {

      
      if (res.statusCode == 200) {

        //获取开奖信息
        wx.request({
          url: reqUrl + 'run_lottery',
          header: {
            token: wx.getStorageSync('token')
          },
          data: {
            id: options.id
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: res => {
            // console.log(res)

            if (res.statusCode == 200) {
              this.setData({
                detailMsg: res.data.msg
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



        wx.request({
          url: 'https://api.koudaihaiwan.com/putPlatformUserData',
          data: {
            scene: options.scene,
            openid: res.data.key,
            from_appid: appid,
            query: options.query
          },
          method: 'POST',
          success: res => {
            // console.log(res)
          }
        })


      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })

      }

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

    var id = this.data.options.id
    return {
      title: '先到先得！口袋喊你大奖一起免费拿',
      path: '/pages/share/share?id=' + id + '&uid=' + wx.getStorageSync('uid'),
    }


  }
})
