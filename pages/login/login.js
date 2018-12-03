const reqUrl = require('../../utils/reqUrl.js')

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: true,
    // hasLogin:false
  },

  /**
   * 事件处理函数
   */

  //用户授权事件
  getUserInfo: function(e) {
    wx.showLoading({
      title: '授权登录中...',
      mask: true
    })

    // console.log(e.detail);
    // avatarUrl
    if (e.detail.userInfo) {

      wx.setStorageSync('nickName', e.detail.userInfo.nickName)

      //提交用户授权
      wx.request({
        // url: reqUrl + 'setinfo',
        url: reqUrl + 'award_setInfo',
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

          wx.hideLoading();

          if (res.statusCode == 200) {
            wx.setStorageSync('key', 1)
            this.setData({
              hasUserInfo: false
            })

            // wx.switchTab({
            //   url: '../index/index',
            // })
            wx.switchTab({
              url: '../indexs/indexs',
            })

          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true
            })

          }
        },
        fail: function(res) {},
        complete: function(res) {},
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
  onLoad: function(options) {
    // console.log(options);
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    let dataArr = (JSON.stringify(options) == "{}");
    if (options.scene != '' && options.scene != undefined) {
      const scene = decodeURIComponent(options.scene);
      let sceneList = scene.split("&");
      var arr = [];
      for (let i in sceneList) {
        // console.log(sceneList[i]);
        this.setData({
          p: sceneList[0].substring(2),
          media: sceneList[1].substring(6),
        })
      }

      // 登录
      wx.login({
        success: res => {
          // console.log(res);
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            // url: reqUrl + 'token',
            url: reqUrl + 'award_token',
            data: {
              code: res.code,
              media: that.data.media,
              p: that.data.p,
              scene: wx.getStorageSync('scene')
              // sponsor_id:
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: res => {

              if (res.statusCode == 200) {
                wx.hideLoading();
                //本地缓存存入token、uid
                wx.setStorageSync("token", res.data.msg);
                wx.setStorageSync("uid", res.data.uid)

                //存openid,question.js的ad上报需要
                wx.setStorageSync('openid', res.data.key)

                // resolve(res)
                wx.switchTab({
                  url: '../indexs/indexs',
                })
              } else {
                console.log(res);
                // reject(res)
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      })
    }else if (options.media != '' && options.media != undefined) {
      this.setData({
        media: options.media,
        p:options.p
      })
      // 登录
      wx.login({
        success: res => {
            // console.log(res);
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            // url: reqUrl + 'token',
            url: reqUrl + 'award_token',
            data: {
              code: res.code,
              media: options.media,
              p: options.p,
              scene: wx.getStorageSync('scene')
              // sponsor_id:
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: res => {

              if (res.statusCode == 200) {
                wx.hideLoading();
                //本地缓存存入token、uid
                wx.setStorageSync("token", res.data.msg);
                wx.setStorageSync("uid", res.data.uid)

                //存openid,question.js的ad上报需要
                wx.setStorageSync('openid', res.data.key)

                // resolve(res)
                wx.switchTab({
                  url: '../indexs/indexs',
                })
              } else {
                // console.log(res);
                // reject(res)
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      })
    }else if (options.uid != '' && dataArr != true) {
      // 登录
      var sponsor_id = options.sponsor_id;
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            // url: reqUrl + 'token',
            url: reqUrl + 'award_token',
            data: {
              code: res.code,
              sponsor_id: sponsor_id,
              scene: wx.getStorageSync('scene')
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: res => {
              // console.log(res);
              wx.hideLoading();
              if (res.statusCode == 200) {
                //本地缓存存入token、uid
                wx.setStorageSync("token", res.data.msg);
                wx.setStorageSync("uid", res.data.uid)

                //存openid,question.js的ad上报需要
                wx.setStorageSync('openid', res.data.key)
                wx.switchTab({
                  url: '../indexs/indexs',
                })
                // resolve(res)
              } else {
                reject(res)
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      })
    } else {
      //异步登录执行完的 resolve 
      getApp().login().then(res => {
        // console.log('进入登录');
        wx.hideLoading()
        if (res.statusCode == 200) {
          // console.log(wx.getStorageSync("nickName"));

          //判断用户是否授权，决定是否显示授权页面
          // if (wx.getStorageSync("nickName")) {
          // }
          wx.switchTab({
            url: '../indexs/indexs',
          })

          //获取终端信息
          wx.getSystemInfo({
            success: function(res) {
              // console.log(res);
              wx.request({
                url: reqUrl + 'award_getSystemInfo',
                header: {
                  token: wx.getStorageSync('token')
                },
                data: res,
                method: 'POST',
                success: res => {
                  // console.log(res)
                }
              })
            },
          })


          //获取app.js存的options，并添加openid属性
          var options = wx.getStorageSync('options');
          // options.openid = res.data.key;

          // console.log(options)
          var appid = options.referrerInfo ? options.referrerInfo.appId : null;
          wx.request({
            url: reqUrl + 'award_putPlatformUserData',
            header: {
              token: wx.getStorageSync('token')
            },
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
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })

        }

      })

    }


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
    return {
      title: '先到先得！口袋喊你大奖一起免费拿',
      path: '/pages/login/login',
    }
  }
})