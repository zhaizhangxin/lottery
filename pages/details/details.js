const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js');

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailMsg: null,
    showModalStatus: false,
    shareAvatarStatus: false,
    rankingStatus: false,
    sponsor_id: '',
    //url传参
    options: null,
    uid: null,
    page: 1,
    rows: 40,
    actionSheetHidden: true,
    report: true

  },
  // 回到首页
  swithTab: function() {
    wx.switchTab({
      url: '../indexs/indexs',
    })
  },
  // 参与人员分页请求
  lower: function(e) {
    console.log(e);
    if (e != '' && this.data.avatarImg.length > 200) {
      this.data.page++;
      var pages = this.data.page++;
      this.setData({
        page: pages
      })
      var that = this;
      wx.request({
        url: reqUrl + 'award_avatar',
        method: 'GET',
        data: {
          id: this.data.id,
          page: this.data.page
        },
        header: {
          token: wx.getStorageSync('token')
        },
        success: res => {
          console.log(res);
          let avatarsImg = that.data.avatarImg;
          this.setData({
            avatarImg: avatarsImg.concat(res.data.msg)
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  // 邀请好友分页
  lowers: function(e) {
    console.log(e);
    if (e != '' && this.data.shareImg.length >= this.data.rows) {
      this.data.page++;
      var pages = this.data.page++;
      this.setData({
        page: pages
      })
      var that = this;
      wx.request({
        url: reqUrl + 'award_shareAvatar',
        method: 'GET',
        data: {
          user_id: wx.getStorageSync('uid'),
          id: this.data.id,
          page: that.data.page,
          rows: that.data.rows
        },
        header: {
          token: wx.getStorageSync('token')
        },
        success: res => {
          console.log(res);
          let avaterMsg = that.data.shareImg;
          let dragonMsg = that.data.dragonball;
          let restrictMsg = that.data.restrict;
          that.setData({
            shareImg: avaterMsg.concat(res.data.msg.avatar),
            dragonball: dragonMsg.concat(res.data.msg.dragonball),
            restrict: restrictMsg.concat(res.data.msg.restrict)
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    }
  },

  // 点击显示参与人数
  avatarPic: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;
    wx.request({
      url: reqUrl + 'award_avatar',
      method: 'GET',
      data: {
        id: this.data.id,
        page: this.data.page
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        wx.hideLoading()
        // console.log(res);
        that.setData({
          avatarImg: res.data.msg,
          showModalStatus: true
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击关闭人数
  exitTop: function() {
    this.setData({
      showModalStatus: false
    })
  },


  // 点击显示我邀请的朋友
  shareAvatar: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;
    wx.request({
      url: reqUrl + 'award_shareAvatar',
      method: 'GET',
      data: {
        user_id: wx.getStorageSync('uid'),
        id: this.data.id,
        page: that.data.page,
        rows: that.data.rows
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        that.setData({
          shareImg: res.data.msg.avatar,
          dragonball: res.data.msg.dragonball,
          restrict: res.data.msg.restrict,
          shareAvatarStatus: true
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 点击关闭我邀请的朋友
  shareAvatarTop: function() {
    this.setData({
      shareAvatarStatus: false
    })
  },

  // 点击查看排名
  ranking: function() {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var that = this;
    wx.request({
      url: reqUrl + 'award_shareRank',
      method: 'GET',
      data: {
        id: this.data.id
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        that.setData({
          avatarUrl: res.data.msg.rankList,
          rankingStatus: true
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  // 点击关闭邀请排名
  rankingTop: function() {
    this.setData({
      rankingStatus: false
    })
  },
  // 点击抽奖
  luckDraw: function(e) {
    let formId = e.detail.formId;
    var getName = wx.getStorageSync('nickName');

    if (getName != '' && this.data.options.pathId != undefined) {
      this.getUserInfo();

    } else {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      var that = this;
      wx.request({
        url: reqUrl + 'award_lottery',
        method: 'POST',
        data: {
          id: this.data.id,
          form_id: formId,
          sponsor_id: this.data.sponsor_id
        },
        header: {
          token: wx.getStorageSync('token')
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          if (res.data.error_code == 0) {
            if (res.data.msg.product_type == 1) {
              var luckPic = {
                avatar_url: res.data.msg
              };
              let user_Pic = that.data.detaPic;
              user_Pic.unshift(luckPic);
              that.setData({
                detaPic: user_Pic
              })
            }
            that.setData({
              'detailMsg.activity.participate': 2
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
    }


  },
  // 用户授权
  //用户授权事件
  getUserInfo: function(e) {
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
            console.log(res);
            this.setData({
              report: true
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
  //显示商品详情图片
  showImg(e) {

    var urls = [];
    for (var i in this.data.detailMsg.detail) {
      urls[i] = this.data.detailMsg.detail[i].detail_img_url
    }

    wx.previewImage({
      current: e.target.dataset.img, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  //用户参与抽奖
  submit(e) {
    // if (this.data.detailMsg.activity.restrict == 0){
    //   wx.showToast({
    //     title: '不满足该商品抽奖条件，夺得这个大奖，快请好友助力吧',
    //     icon:'none',
    //     mask:true
    //   })

    //   return 
    // }

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //事件触发当前活动id,index
    let id = e.detail.target.dataset.id;

    wx.request({
      url: reqUrl + 'lottery',
      data: {
        id: id,
        form_id: e.detail.formId
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        // console.log(res)
        wx.hideLoading();
        if (res.statusCode === 200) {

          wx.showToast({
            title: '参与成功',
            icon: 'success',
            mask: true
          })


          //点击抽奖显示当前页面分享
          wx.showShareMenu({})

          //添加头像
          var obj = {}
          obj.avatar_url = res.data.msg;
          this.data.detailMsg.avatar.unshift(obj);

          this.setData({
            'detailMsg.activity.participate': 2,
            'detailMsg.activity.participants': parseInt(this.data.detailMsg.activity.participants) + 1,
            'detailMsg.avatar': this.data.detailMsg.avatar,
          })

        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg,
          })

        }

      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  // 点击上报
  click(e) {

    if (this.data.detailMsg.activity.type == 1) {

      //调用组件actionSheet的_animationOuter方法
      this.selectComponent('#actionSheet').animationOuter(e.currentTarget.dataset.qr)
      return;
    }

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: reqUrl + 'click',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 分享给好友
  listenerButton: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  listenerActionSheet: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  // 一键复制
  detaGroup: function(e) {
    var detaGroup = e.target.dataset.href;
    wx.setClipboardData({
      data: detaGroup,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res);
          }
        })
      }
    })
  },
  // 生成分享卡片
  shareCord: function(e) {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })

    wx.request({
      url: reqUrl + 'award_shareImg',
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        product_name: e.target.dataset.name,
        product_img: e.target.dataset.src,
        activity_id: e.target.dataset.id,
      },
      dataType: 'json',
      responseType: 'text',
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.error_code == 0) {
          wx.navigateTo({
            url: '../raffleTickets/raffleTickets?shareCord=' + res.data.msg
          })
        } else {
          wx.showToast({
            title: res.data.msg
          })
        }
      }
    })

  },
  optionPath: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;

    //获取活动商品详情
    wx.request({
      // url: reqUrl + 'detail',
      url: reqUrl + 'award_detail',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: that.data.id
        // id: 996
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.msg.product_type == 1) {
            this.setData({
              detaPic: res.data.msg.avatar
            })
          }
          this.setData({
            detailMsg: res.data.msg
          })

          //添加倒计时
          let time = Number(res.data.msg.activity.time) - Math.round(new Date / 1000);
          let countDown = 'detailMsg.activity.time';

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



          //未点击抽奖，隐藏当前页面分享
          if (this.data.detailMsg.activity.participate != 2) {
            wx.hideShareMenu({});
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
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      options: options,
      uid: wx.getStorageSync('uid')
    })
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
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var getName = wx.getStorageSync('nickName');
    console.log(getName);
    console.log(this.data.options.pathId);
    if (getName != '' && this.data.options.pathId != undefined) {
      this.setData({
        report: false
      })
    } else {
      this.setData({
        report: true
      })
    }
    if (this.data.options.pathId != undefined) {
      // 登录
      wx.login({
        success: res => {

          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            // url: reqUrl + 'token',
            url: reqUrl + 'award_token',
            data: {
              code: res.code,
              sponsor_id: this.data.options.id
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
                this.optionPath();

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
      this.optionPath();
    }

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

    var arr = [',免费给你个东西敢要吗？', '正在参与口袋夺奖，拜托你为他助力', '在口袋抽奖申请免费试玩，快来帮他助力吧'];
    var i = Math.floor(Math.random() * 3);

    var id = this.data.options.id;
    var uid = this.data.uid;

    return {
      title: wx.getStorageSync('nickName') + arr[i],
      path: '/pages/details/details?id=' + id + '&uid=' + uid + '&pathId=' + 1,
      success: res => {

      },
      fail: function(res) {
        wx.showToast({
          title: '转发失败，请重试',
        })
      }
    }

  }
})