const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js');

// pages/detail/detail.js
var _animation; // 动画实体
var _animationIndex = 0; // 动画执行次数index（当前执行了多少次）
var _animationIntervalId = -1; // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 2000; // 动画播放一次的时长ms

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
    report: true,
    recomends: false,
    confirmLucky: false,
    confirmLuckys:false,
    sponsonId: 1,
    optionId: 1,
    animationData: {},
    animationDatas:{},
    winnersList:false,
    detailMask:true,
    navpath:'',
    uids:'',
    isClose:true,
    clickData:'',
    animation:''
  },
  // 点击关闭弹窗
  detailExit: function () {
    this.setData({
      detailMask: false
    })
  },
  // 中奖人数
  winnerList:function(){
    this.setData({
      winnersList:true
    })
  },
  winnerExit:function(){
    this.setData({
      winnersList: false
    })
  },
  // 回到首页
  swithTab: function() {
    wx.switchTab({
      url: '../indexs/indexs',
    })
  },
  // 更多商品跳转
  detaliJump: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  },
  // 参与人员分页请求
  lower: function(e) {
    if (e != '' && this.data.avatarImg.length >= 200) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      console.log('分页');
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
          wx.hideLoading();
          // console.log(res);
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
    if (e != '' && this.data.shareImg.length >= this.data.rows) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
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
          // console.log(res);
          wx.hideLoading();
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
        // console.log(res);
        wx.hideLoading();
        that.setData({
          shareImg: res.data.msg.avatar,
          dragonball: res.data.msg.dragonball,
          restrict: res.data.msg.restrict,
          shareAvatarStatus: true
        })
      },
      fail: function(res) {},
      complete: function(res) {},
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
      mask: true
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
        // console.log(res);
        that.setData({
          avatarUrl: res.data.msg.rankList,
          rankingStatus: true
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  // 点击关闭邀请排名
  rankingTop: function() {
    this.setData({
      rankingStatus: false
    })
  },
  // 点击关闭抽奖
  confirMaskExit: function() {
    this.setData({
      confirmLuckys: false,
      confirmLucky:false
    })
    this.stopAnimationInterval();
  },
  // 点击抽奖
  luckDraw: function(e) {
    this.startAnimationInterval();//开始旋转
    let formId = e.detail.formId;
    this.setData({
      formId: formId
    })
    var getName = wx.getStorageSync('nickName');
    var that = this;
    // console.log(getName);
    // console.log(this.data.options.pathId);
    // console.log(this.data.sponsor_id);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    setTimeout(function() {
      that.setData({
        confirmLucky: true,
        confirmLuckys:true
      })
      wx.hideLoading();
    }, 500);

  },
  // 确认抽奖
  conLucky: function() {
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
        form_id: this.data.formId,
        sponsor_id: this.data.uids
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        wx.hideLoading();
        that.stopAnimationInterval();
        that.setData({
          confirmLucky: false,
          // confirmLuckys: false,
          'detailMsg.activity.participants': parseInt(this.data.detailMsg.activity.participants) + 1,

        })
        // console.log(res);
        if (res.data.error_code == 0) {
          if (that.data.product_type == 1) {
            var luckPic = {
              avatar_url: res.data.msg
            };
            let user_Pic = that.data.detaPic;
            user_Pic.unshift(luckPic);
            that.setData({
              detaPic: user_Pic,
              'detailMsg.activity.participate': 2
            })
          } else {
            that.setData({
              'detailMsg.activity.participate': 2
            })
          }
        } else {
          that.setData({
            titles: res.data.msg
          })
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
  },
  // 用户授权
  //用户授权事件
  getUserInfo: function(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    var that = this;
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
          // console.log('请求成功');
          wx.hideLoading();
          wx.setStorageSync('key', 1)
          if (res.statusCode == 200) {
            // console.log(res);
            that.setData({
              report: true,
              sponsonId: 2,
              optionId: 2
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
    var that = this;
    // console.log(e);
    this.setData({
      clickData:e,
      types:0
    })
    if (e.currentTarget.dataset.key != ''){
      if (e.currentTarget.dataset.key == 1){
        wx.navigateToMiniProgram({
          appId: this.data.detailMsg.activity.app_id,
          path: this.data.detailMsg.activity.path,
          extraData: this.data.detailMsg.activity.extra_data,
          success:res=>{
            that.setData({
              types:1
            })
            this.conLucky();
            this.clicksData();
            this.stopAnimationInterval();
            this.setData({
              confirmLuckys: false,
              confirmLucky:false,
              isClose:false
            })
          },
          fail:function(){
            console.log('跳转失败');
          },
          complete:function(){}
        })

        
      } else {
        wx.navigateToMiniProgram({
          appId: this.data.detailMsg.activity.app_id,
          path: this.data.detailMsg.activity.path,
          extraData: this.data.detailMsg.activity.extra_data,
          success: res => {
            that.setData({
              types: 1
            })
            this.clicksData();
          },
          fail: function () {
          },
          complete: function () { }
        })
      }
    } else {
      wx.navigateToMiniProgram({
        appId: this.data.detailMsg.activity.app_id,
        path: this.data.detailMsg.activity.path,
        extraData: this.data.detailMsg.activity.extra_data,
        success: res => {
          that.setData({
            types: 1
          })
          this.clicksData();
        },
        fail: function () {
        },
        complete: function () { }
      })
    }

    if (e.currentTarget.dataset.key != '') {
      if (e.currentTarget.dataset.key == 1) {
        if (e.currentTarget.dataset.path) {
          let url = encodeURIComponent(e.currentTarget.dataset.path);
          wx.navigateTo({
            url: '../h5ad/h5ad?h5ad=' + url
          })
          this.conLucky();
          this.clicksData();
          this.setData({
            confirmLuckys: false,
            confirmLucky: false,
            isClose: false
          })
          this.stopAnimationInterval();
        }

      }else{
        if (e.currentTarget.dataset.path) {
          let url = encodeURIComponent(e.currentTarget.dataset.path);
          this.clicksData();
          wx.navigateTo({
            url: '../h5ad/h5ad?h5ad=' + url
          })
        }
      }

    } else {
      if (e.currentTarget.dataset.path) {
        let url = encodeURIComponent(e.currentTarget.dataset.path);
        this.clicksData();
        wx.navigateTo({
          url: '../h5ad/h5ad?h5ad=' + url
        })
      }
    }

    if (this.data.detailMsg.activity.type == 1) {
      //调用组件actionSheet的_animationOuter方法
      this.selectComponent('#actionSheet').animationOuter(e.currentTarget.dataset.qr)
      return;
    }
    this.clicksData();
  
  },
  clicksData:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;
    console.log(that.data.types);
    wx.request({
      url: reqUrl + 'award_click',
      data: {
        id: that.data.clickData.currentTarget.dataset.id,
        type:that.data.types
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      success: function (res) {
        // console.log(res);
        // if (e.currentTarget.dataset.qr != '') {
        //   var url = e.currentTarget.dataset.qr;
        //   var imgArr = [];
        //   imgArr.push(url);
        //   wx.previewImage({
        //     current: imgArr[0], // 当前显示图片的http链接 
        //     urls: imgArr // 需要预览的图片http链接”列表“ 
        //   });
        // }
        wx.hideLoading();
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 识别图中二维码
  previewImage:function(e){
    var url = e.currentTarget.dataset.icon;
    var imgArr = [];
    imgArr.push(url);
    wx.previewImage({
      current: imgArr[0], // 当前显示图片的http链接 
      urls: imgArr // 需要预览的图片http链接”列表“ 
    });
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
    // console.log(e);
    var detaGroup = e.currentTarget.dataset.href;
    wx.setClipboardData({
      data: detaGroup,
      success(res) {
        wx.getClipboardData({
          success(res) {
            // console.log(res);
          }
        })
      }
    })
  },
  // 生成分享卡片
  shareCord: function(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
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
        // console.log(res);
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
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        // console.log(res)
        if (res.statusCode == 200) {
          // console.log(that.data.navpath);
          if (that.data.navpath == 1){
            if (res.data.msg.luck_user.is_luck != 1) {
              that.setData({
                detailMask: true
              })
            } else {
              that.setData({
                detailMask: false
              })
            }
          }
          if (res.data.msg.product_type == 1) {
            this.setData({
              product_type: res.data.msg.product_type
            })
          }
          this.setData({
            detailMsg: res.data.msg,
            detaPic: res.data.msg.avatar
          })
          if (that.data.detailMsg.activity.status == -1){
            this.setData({
              detailTime: res.data.msg.activity.time
            })
          }else{
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
          }



          //未点击抽奖，隐藏当前页面分享
          if (this.data.detailMsg.activity.participate != 2) {
            wx.hideShareMenu({});
          }

          wx.request({
            url: reqUrl + 'award_ad',
            header: {
              token: wx.getStorageSync('token')
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            data: {
              detail_type: that.data.detailMsg.product_type
            },
            success: res => {
              // console.log(res);
              that.setData({
                listMsg:res.data.msg
              })
            },
            fail: function (res) { },
            complete: function (res) { },
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
      fail: function(res) {},
      complete: function(res) {},
    })

   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    this.setData({
      id: options.id,
      options: options,
      uid: wx.getStorageSync('uid'),
      uids: options.uid,
      navpath: options.navpath
    })
    // console.log(options.scene);

    if (options.scene != '' && options.scene != undefined) {
      const scene = decodeURIComponent(options.scene);
      let sceneList = scene.split("&");
      var arr = [];
      for (let i in sceneList) {
        this.setData({
          sponsor_id: sceneList[0].substring(11),
          id: sceneList[1].substring(11),
        })
      }
      // console.log(this.data.sponsor_id);
      // console.log(this.data.product_id);
    }
    // console.log(wx.getStorageSync("nickName"));

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    _animationIndex = 0;
    _animationIntervalId = -1;
    this.data.animation = ''; 
  },
  login:function(){
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: reqUrl + 'award_token',
          data: {
            code: res.code,
            sponsor_id: this.data.options.uid,
            scene: wx.getStorageSync('scene')
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
              that.setData({
                token: res.data.msg
              })
              // console.log(res);
              // console.log(wx.getStorageSync('token'));
              this.optionPath();

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
                      // console.log(res)
                      // console.log(wx.getStorageSync('token'));

                    }
                  })
                },
              })

              var options = wx.getStorageSync('options');
              // options.openid = res.data.key;

              console.log(options)
              var appid = options.referrerInfo ? options.referrerInfo.appId : null;
              wx.request({
                url: reqUrl + 'award_putPlatformUserData',
                header: {
                  token: wx.getStorageSync('token')
                },
                data: {
                  scene: options.scene,
                  openid: wx.getStorageSync('openid'),
                  from_appid: appid,
                  query: options.query
                },
                method: 'POST',
                success: res => {
                  // console.log(res)
                }
              })


            } else {
              reject(res)
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })

    console.log(options);
    if (this.data.clickData != ''){
      // console.log(this.data.clickData);
      // if (this.data.clickData.currentTarget.dataset.key != '') {
        if (this.data.clickData.currentTarget.dataset.key == 1) {
          if (!this.data.isClose) {
            wx.showModal({
              title:'提示',
              content: this.data.titles
            })
          }
        }
      // }
    }
    // wx.setStorageSync('scene', options.scene)
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
    })
    this.animation = animation
    var next = true;
    //连续动画关键步骤
    setInterval(function() {
      if (next) {
        this.animation.scale(0.8).step()
        next = !next;
      } else {
        this.animation.scale(1).step()
        next = !next;
      }
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 500)


    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var getName = wx.getStorageSync('nickName');
    if (wx.getStorageSync("key") == 1 && this.data.options.pathId == undefined) {
      console.log('未授权');
      this.setData({
        report: false
      })
      this.login();
    } else if (this.data.options.pathId == 1) {
      console.log('分享');
      this.setData({
        report: false
      })
      this.login();
    } else if (this.data.sponsor_id != undefined && this.data.sponsor_id != '') {
      console.log('二维码');
      this.login();
      this.setData({
        report: false
      })
    } else {
      console.log('正常');
      this.optionPath();
      this.setData({
        report: true
      })
    }
  },
  rotateAni: function (n) {
    _animation.rotate(120 * (n)).step()
    this.setData({
      animation: _animation.export()
    })
  },

  /**
   * 开始旋转
   */
  startAnimationInterval: function () {
    var that = this;
    that.rotateAni(++_animationIndex); // 进行一次旋转
    _animationIntervalId = setInterval(function () {
      that.rotateAni(++_animationIndex);
    }, _ANIMATION_TIME); // 每间隔_ANIMATION_TIME进行一次旋转
  },
  // 停止旋转
  stopAnimationInterval: function () {
    if (_animationIntervalId > 0) {
      clearInterval(_animationIntervalId);
      _animationIntervalId = 0;
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
    console.log(id);
    console.log(uid);
    return {
      title: wx.getStorageSync('nickName') + arr[i],
      imageUrl: this.data.detailMsg.share_img,
      path: '/pages/details/details?id=' + id + '&uid=' + uid + '&pathId=' + 1,
      success: res => {

      },
      fail: function(res) {
        wx.showToast({
          title: '转发失败，请重试',
          icon: 'none'
        })
      }
    }

  }
})