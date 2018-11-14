const reqUrl = require('utils/reqUrl');

//app.js
App({
  //login promise
  login() {

    return new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: res => {

          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            // url: reqUrl + 'token',
            url: reqUrl + 'award_token',
            data: {
              code: res.code
              // sponsor_id:
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: res => {

              if (res.statusCode == 200) {
                //本地缓存存入token、uid
                wx.setStorageSync("token", res.data.msg);
                wx.setStorageSync("uid", res.data.uid)

                //存openid,question.js的ad上报需要
                wx.setStorageSync('openid', res.data.key)

                resolve(res)
              }else{
                reject(res)
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      })

    })

  },

  onLaunch: function (options) {
    console.log(options);
    wx.setStorageSync('options', options)

  },
  globalData: {
    userInfo: null
  }
})