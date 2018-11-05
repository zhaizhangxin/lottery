// pages/share/share.js
const reqUrl = require('../../utils/reqUrl.js');
const formatTime = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    msg:null,
    options:null,
  },


  getUserInfo(e){

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // wx.showLoading({
    //   title: '授权登录中...',
    //   mask: true
    // })


    if (e.detail.userInfo) {

      wx.setStorageSync('nickName', e.detail.userInfo.nickName)

      wx.request({
        url: reqUrl + 'setinfo',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        header: {
          token: wx.getStorageSync('token')
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: res => {


          if (res.statusCode == 200) {
            wx.request({
              url: reqUrl + 'shareHelp',
              header: {
                token: wx.getStorageSync('token')
              },
              data: {
                id: this.data.options.id,
                user_id: this.data.options.uid
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: res => {
                // console.log(res)

                wx.hideLoading();
                if (res.statusCode == 200) {

                  wx.showToast({
                    title: '助力成功',
                    icon: 'success',
                    mask: true
                  })

                  //添加头像
                  var obj = {}
                  obj.avatar_url = res.data.msg;
                  this.data.msg.avatar_obj.unshift(obj);
                  

                  this.setData({
                    'msg.is_share': 2,
                    'msg.share_count': parseInt(this.data.msg.share_count) + 1,
                    'msg.avatar_obj': this.data.msg.avatar_obj,
                  })


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
            wx.hideLoading();
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
      wx.hideLoading();
      wx.showToast({
        title: '授权登录失败！',
        icon: 'none',
        duration: 1000
      })
    }
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

        //获取分享详情信息
        wx.request({
          url: reqUrl + 'shareDetail',
          header: {
            token: wx.getStorageSync('token')
          },
          data: {
            id: options.id,
            user_id: options.uid
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: res => {
            // console.log(res.data.msg)


            wx.hideLoading();
            if (res.statusCode == 200) {

              this.setData({
                msg: res.data.msg,
              })

              //添加倒计时
              let time = Number(res.data.msg.lottery_time) - Math.round(new Date / 1000);
              let countDown = 'msg.lottery_time';

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

            } else {

              setTimeout(() => {
                wx.redirectTo({
                  url: '../login/login'
                })
              }, 500)

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
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })

      }

    })
    // .catch( err =>{

    //   setTimeout(() => {
    //     wx.redirectTo({
    //       url: '../login/login'
    //     })
    //   }, 500)

    //   wx.showToast({
    //     title: err.data.msg,
    //     icon: 'none',
    //     mask: true
    //   })
    // })
   
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
    var options = this.data.options
    return {
      title: '先到先得！口袋喊你大奖一起免费拿',
      path: '/pages/share/share?id=' + options.id + '&uid=' + options.uid,
    }
  }
})

