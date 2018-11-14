// pages/lotteryRecord/lotteryRecord.js
const reqUrl = require('../../utils/reqUrl.js');
const formatTime = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //获取抽奖记录信息
    wx.request({
      url: reqUrl + 'award_lottery_recode',
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

          //添加倒计时
          for (let i in res.data.msg.not_lottery) {

            let time = Number(res.data.msg.not_lottery[i].lottery_time) - Math.round(new Date / 1000);
            let countDown = 'msg.not_lottery[' + i + '].lottery_time';

            this.setData({
              [countDown]: formatTime.formatTime(time)
            })

            var interval = setInterval(() => {
              if (Number(time) > 0) {
                time--;
                this.setData({
                  [countDown]: formatTime.formatTime(time)
                })

              } else {
                clearInterval(interval);
              }
            }, 1000)

          }   

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