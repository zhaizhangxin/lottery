// pages/mine/mine.js
const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    //倒计时
    interval: '',
  },
  // 点击切换
  clickTab:function(e){
    var that = this;
    if(that.data.currentTab === e.target.dataset.current){
      return false;
    }else{
      that.setData({
        currentTab:e.target.dataset.current
      })
    }
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  currDeils:function(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let ids = e.currentTarget.dataset.actid;
    console.log(ids);
    if (e.currentTarget.dataset.status == 0){
      wx.navigateTo({
        url: '../lottery/lottery?id=' + ids
      })
    }else{
      wx.navigateTo({
        url: '../details/details?id=' + ids
      })
    }
  },  
  currDeil:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lottery/lottery?id=' + id
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 中奖记录
    wx.request({
      url: reqUrl + 'award_order_list',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      success: res => {
        console.log(res)
        wx.hideLoading();
        if (res.statusCode == 200) {
          let msg = res.data.msg;
          this.setData({
            orderMsg: res.data.msg,
            height: 460 * res.data.msg.length
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
    //获取抽奖记录
    wx.request({
      url: reqUrl + 'award_lottery_recode',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      success: res => {
        wx.hideLoading();
        console.log(res)
        if (res.statusCode == 200) {
          let msg = res.data.msg;
          this.setData({
            msg: res.data.msg,
            height: 460 * res.data.msg.length
          })

          //清除倒计时
          var interval = this.data.interval;
          if (interval != '') {
            for (let i = interval - lottery.length; i <= interval; i++) {
              clearInterval(i)
            }
          }

          //添加倒计时
          for (let i in msg) {
            let time = Number(msg[i].lottery_time) - Math.round(new Date / 1000);
            let countDown = 'msg[' + i + '].lottery_time';
            msg[i].lottery_time = time;
            this.setData({
              [countDown]: formatTime.formatTime(time)
            })

            this.data.interval = setInterval(() => {
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

  }
})