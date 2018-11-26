const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

//index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //滚动消息
    rollMsg: '',
    //活动信息
    lottery: [],
    rank: [],
    collect: [],
    // page:1,
    // pageStatus:true,

    //倒计时
    interval: '',
    signInSuccess: false,
    maskingShow:false,
    group:false,
  },
  // 关闭引导
  group_mask:function(){
    this.setData({
      maskingShow: false
    })
  },

  // 规则页面
  rules:function(){
    wx.navigateTo({
      url: '../rules/rules',
    })
  },
  codeGroup:function(){
    this.setData({
      group:true
    })
  },
  groupExit:function(){
    this.setData({
      group: false
    })
  },
  // 识别图中二维码
  previewImage: function (e) {
    var url = e.currentTarget.dataset.icon;
    var imgArr = [];
    imgArr.push(url);
    wx.previewImage({
      current: imgArr[0], // 当前显示图片的http链接 
      urls: imgArr // 需要预览的图片http链接”列表“ 
    });
  },
  /**
   * 事件处理函数
   */

  detaliJump: function(e) {
    // console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id
      // url: '../lottery/lottery?id=' + id
      
    })
  },
  //用户授权事件
  getUserInfo: function (e) {
    wx.showLoading({
      title: '授权登录中...',
      mask: true
    })

    console.log(e.detail);
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
              maskingShow: false
            })
            // wx.switchTab({
            //   url: '../indexs/indexs',
            // })

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
      this.setData({
        maskingShow: false
      })
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
    let that = this;
    console.log(options);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    let dataArr = (JSON.stringify(options) == "{}");
    if (options.media != '' && options.media != undefined) {
      this.setData({
        media: options.media,
        p: options.p
      })
      // 登录
      wx.login({
        success: res => {
          console.log(res);
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
    } else if (options.uid != '' && dataArr != true) {
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
              console.log(res);
              wx.hideLoading();
              if (res.statusCode == 200) {
                //本地缓存存入token、uid
                wx.setStorageSync("token", res.data.msg);
                wx.setStorageSync("uid", res.data.uid)

                //存openid,question.js的ad上报需要
                wx.setStorageSync('openid', res.data.key)
                // resolve(res)
              } else {
                reject(res)
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      })
    } else {
      //异步登录执行完的 resolve 
      getApp().login().then(res => {
        console.log(res);
        wx.hideLoading()
        if (res.statusCode == 200) {
          console.log(wx.getStorageSync("nickName"));
          //判断用户是否授权，决定是否显示授权页面
          if (wx.getStorageSync('is_auto') != 0){
            that.setData({
              maskingShow: true
            })
          }
          // if (wx.getStorageSync("nickName")) {
          //   that.setData({
          //     maskingShow: false
          //   })
          // }else{
          //   // that.showQuery();
          // }

          //获取终端信息
          wx.getSystemInfo({
            success: function (res) {
              console.log(res);
              wx.request({
                url: reqUrl + 'award_getSystemInfo',
                header: {
                  token: wx.getStorageSync('token')
                },
                data: res,
                method: 'POST',
                success: res => {
                  console.log(res)
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
  // 签到
  signIn: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;
    wx.request({
      url: reqUrl + 'award_sign',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();

        console.log(res);
        if (res.data.error_code == 0) {
          that.setData({
            signInSuccess: true
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            mask: true
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击关闭
  successExit: function() {
    this.setData({
      signInSuccess: false,
      lottery_num: parseInt(this.data.lottery_num) + 1,
      is_sign:1
    })

  },
  showQuery:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //获取奖品活动列表信息
    wx.request({
      // url: reqUrl + 'ad',
      url: reqUrl + 'award_ad',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        console.log(res);
        if (res.statusCode == 200) {
          // 滚动信息
          var rollMsg = res.data.msg.roll;
          this.setData({
            rollMsg: rollMsg
          })
          // 抽奖次数
          this.setData({
            lottery_num: res.data.msg.lottery_num,
            wining_num: res.data.msg.wining_num,
            is_sign: res.data.msg.is_sign,
            share_img: res.data.msg.share_img,
            qr_crowd: res.data.msg.qr_crowd
          })
          // 已中奖人数

          // 天天免费抽奖
          var lottery = res.data.msg.lottery;
          //状态排序，已参与在后面,状态相同,按时间升序
          var lottery = res.data.msg.lottery.sort(function (a, b) {
            if (a.participate === b.participate) {
              return a.lottery_time - b.lottery_time;
            } else {
              return a.participate - b.participate;
            }
          })
          this.setData({
            lottery: lottery
          })

          // 邀请好友
          var rank = res.data.msg.rank;
          if (rank != undefined && rank != '') {
            //状态排序，已参与在后面,状态相同,按时间升序
            var rank = res.data.msg.rank.sort(function (a, b) {
              if (a.participate === b.participate) {
                return a.lottery_time - b.lottery_time;
              } else {
                return a.participate - b.participate;
              }
            })
            this.setData({
              rank: rank
            })
          } else {
            let rank = '';
            this.setData({
              rank: rank
            })
          }

          // 排名
          var collect = res.data.msg.collect;
          if (collect != undefined && collect != '') {
            //状态排序，已参与在后面,状态相同,按时间升序
            var collect = res.data.msg.collect.sort(function (a, b) {
              if (a.participate === b.participate) {
                return a.lottery_time - b.lottery_time;
              } else {
                return a.participate - b.participate;
              }
            })
            this.setData({
              collect: collect
            })
          } else {
            let collect = '';
            this.setData({
              collect: collect
            })
          }

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
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;

    // setTimeout(function(){

    // },1000)
        that.showQuery();

    
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    // if (this.data.pageStatus && this.data.activityMsg.length % 5 == 0){

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: reqUrl + 'award_ad',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();

        wx.hideLoading();
        console.log(res);
        if (res.statusCode == 200) {

          // 滚动信息
          var rollMsg = res.data.msg.roll;
          this.setData({
            rollMsg: rollMsg
          })
          // 抽奖次数
          this.setData({
            lottery_num: res.data.msg.lottery_num,
            wining_num: res.data.msg.wining_num,
            is_sign: res.data.msg.is_sign,
            share_img: res.data.msg.share_img,
            qr_crowd: res.data.msg.qr_crowd
          })
          // 已中奖人数

          // 天天免费抽奖
          var lottery = res.data.msg.lottery;
          //状态排序，已参与在后面,状态相同,按时间升序
          var lottery = res.data.msg.lottery.sort(function (a, b) {
            if (a.participate === b.participate) {
              return a.lottery_time - b.lottery_time;
            } else {
              return a.participate - b.participate;
            }
          })
          this.setData({
            lottery: lottery
          })

          // 邀请好友
          var rank = res.data.msg.rank;
          if (rank != undefined && rank != '') {
            //状态排序，已参与在后面,状态相同,按时间升序
            var rank = res.data.msg.rank.sort(function (a, b) {
              if (a.participate === b.participate) {
                return a.lottery_time - b.lottery_time;
              } else {
                return a.participate - b.participate;
              }
            })
            this.setData({
              rank: rank
            })
          } else {
            let rank = '';
            this.setData({
              rank: rank
            })
          }

          // 排名
          var collect = res.data.msg.collect;
          if (collect != undefined && collect != '') {
            //状态排序，已参与在后面,状态相同,按时间升序
            var collect = res.data.msg.collect.sort(function (a, b) {
              if (a.participate === b.participate) {
                return a.lottery_time - b.lottery_time;
              } else {
                return a.participate - b.participate;
              }
            })
            this.setData({
              collect: collect
            })
          } else {
            let collect = '';
            this.setData({
              collect: collect
            })
          }

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
    // wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    
    // } else {
    //   wx.showToast({
    //     title: '没有更多了',
    //     icon: 'none',
    //     mask: true,
    //     duration:500,
    //   })
    // }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var uid = wx.getStorageSync('uid');
    console.log(uid);
    return {
      title: '先到先得！口袋喊你大奖一起免费拿',
      path: '/pages/login/login?uid=' + uid,
      imageUrl: this.data.share_img
    }
  }

})